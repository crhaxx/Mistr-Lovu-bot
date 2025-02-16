const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description: "Ztlumí uživatele po určitou dobu",
  options: [
    {
      name: "uzivatel",
      description: "Uživatel, kterého chcete ztlumit",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "doba",
      description: "Doba ztlumení (např. 30m, 1h, 1d)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "duvod",
      description: "Důvod pro ztlumení",
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
    const mentionable = interaction.options.get("uzivatel").value;
    const duration = interaction.options.get("doba").value;
    const reason = interaction.options.get("duvod")?.value || "Bez důvodu";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("Tento uživatel není na serveru");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("Nemůžu ztlumit roboty");
      return;
    }

    const msDuration = ms(duration);

    if (isNaN(msDuration)) {
      await interaction.editReply(
        "Špatný formát doby. Použijte 'ms' formát (např. 30m, 1h, 1d)"
      );
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply("Doba ztlumení musí být mezi 5s a 28 dny");
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "Nemůžete ztlumit uživatele se stejnou nebo vyšší rolí.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content: "Nemůžu ztlumit uživatele se stejnou nebo vyšší rolí.",
      });
      return;
    }

    //Note: Timeouts the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply({
          content: `${targetUser.user.tag} byl ztlumen na ${prettyMs(
            msDuration,
            { verbose: true }
          )}.\nDůvod: ${reason}`,
        });
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply({
        content: `${targetUser.user.tag} byl ztlumen na ${prettyMs(msDuration, {
          verbose: true,
        })}.\nDůvod: ${reason}`,
      });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },
};
