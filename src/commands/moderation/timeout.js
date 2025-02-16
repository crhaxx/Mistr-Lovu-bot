const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description: "Timeout user for a given amount of time",
  options: [
    {
      name: "target-user",
      description: "The user to be timed out",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duration (30m, 1h, 1d)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user is not on the server");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I cannot timeout bots");
      return;
    }

    const msDuration = ms(duration);

    if (isNaN(msDuration)) {
      await interaction.editReply(
        "Invalid duration. Use 'ms' format (e.g., 30m, 1h, 1d)"
      );
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration must be between 5s and 28 days"
      );
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "You can't timeout someone with the same or higher role.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "I can't timeout someone with the same or higher role.",
      });
      return;
    }

    //Note: Timeouts the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply({
          content: `Successfully timed out ${
            targetUser.user.tag
          } for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`,
        });
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply({
        content: `${targetUser.user.tag} was timed out for ${prettyMs(
          msDuration,
          { verbose: true }
        )}.\nReason: ${reason}`,
      });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },
};
