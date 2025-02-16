const {
  Client,
  Intraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  //deleted: true,
  name: "kick",
  description: "Vyhodí uživatele!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "uzivatel",
      description: "Uživatel, kterého chcete vyhodit",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "duvod",
      description: "Důvod pro vyhození uživatele",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  /**
   *
   * @param {Client} client
   * @param {Intraction} interaction
   */

  callback: async (client, interaction) => {
    const tagretUserId = interaction.options.get("uzivatel").value;
    const reason = interaction.options.get("duvod")?.value || "Bez důvodu";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(tagretUserId);

    if (!targetUser) {
      await interaction.editReply({
        content: "Nemůžu najít tohoto uživatele.",
      });
      return;
    }

    if (tagretUserId === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "You can't kick the owner of the server.",
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "Nemůžete vyhodit majitele serveru.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "Nemůžu vyhodit uživatele se stejnou nebo vyšší rolí.",
      });
      return;
    }

    //Note: Kicks the target user
    try {
      await targetUser.kick({ reason });
      await interaction.editReply({
        content: `Uživatel ${targetUser.user.tag} byl vyhozen z důvodu: ${reason}`,
      });
    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
    }
  },
};
