const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "remove-vip",
  description: "Oddělej vip uživateli",

  options: [
    {
      name: "uzivatel",
      description: "Uživatel, kterému chcete oddělat vip",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duvod",
      description: "Důvod za oddělání vip (uživatel obdrží v DMs)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  permissionsRequired: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("uzivatel").value;
    const message = interaction.options.get("duvod").value;

    console.log(targetUserId);

    await interaction.deferReply();

    const getTargetUser = await interaction.guild.members.fetch(targetUserId);

    if (!getTargetUser) {
      await interaction.editReply({
        content: "Nemůžu najít tohoto uživatele.",
      });
      return;
    }

    if (targetUserId === interaction.guild.ownerId) {
      await interaction.editReply({
        content: "Nemůžete oddělat Vip majitelovi serveru.",
      });
      return;
    }

    const targetUserRolePosition = getTargetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "Nemůžete oddělat Vip uživatelovi se stejnou nebo vyšší rolí.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content:
          "Nemůžu oddělat Vip uživatelovi se stejnou nebo vyšší rolí než já.",
      });
      return;
    }

    const role = interaction.guild.roles.cache.find(
      (r) => r.name === "💎 VIP člen"
    );

    try {
      await getTargetUser.roles.remove(role);
      await getTargetUser.send(`Přišel/a jsi o vip za ${message}! 😔`);
      await interaction.editReply({
        content: `Vip bylo odděláno uživateli <@${targetUserId}> za ${message}`,
      });
    } catch (error) {
      console.log(`There was an error while running add-vip: ${error}`);
    }
  },
};
