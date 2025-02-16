const {
  Client,
  Intraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  //deleted: true,
  name: "ban",
  description: "Bans a member!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "The user to ban.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for banning.",
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
    const tagretUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(tagretUserId);

    if (!targetUser) {
      await interaction.editReply({
        content: "Couldn't find the user.",
      });
      return;
    }

    if (tagretUserId === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "You can't ban the owner of the server.",
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "You can't ban someone with the same or higher role.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "I can't ban someone with the same or higher role.",
      });
      return;
    }

    //Note: Ban the target user
    try {
      await targetUser.ban({ reason });
      await interaction.editReply({
        content: `User ${targetUser.user.tag} has been banned for: ${reason}`,
      });
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },
};
