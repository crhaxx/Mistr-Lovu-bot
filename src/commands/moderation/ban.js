const {
  Client,
  Intraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  //deleted: true,
  name: "ban",
  description: "Zabanuje uživatele",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "uzivatel",
      description: "Uživatel, kterého chcete zabanovat",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "duvod",
      description: "Důvod pro zabanování",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

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
        content: "Nemůžete zabanovat majitele serveru.",
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "Nemůžete zabanovat uživatele se stejnou nebo vyšší rolí.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content:
          "Nemůžu zabanovat uživatele se stejnou nebo vyšší rolí než já.",
      });
      return;
    }

    //Note: Ban the target user
    try {
      await targetUser.ban({ reason });
      await interaction.editReply({
        content: `Uživatel ${targetUser.user.tag} byl zabanován z důvodu: ${reason}`,
      });
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },
};
