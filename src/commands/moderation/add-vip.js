const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "add-vip",
  description: "Přidej vip uživateli",

  options: [
    {
      name: "uzivatel",
      description: "Uživatel, který chcete přidat jako vip",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duvod",
      description: "Důvod za udělení vip (uživatel obdrží v DMs)",
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
        content: "Nemůžete dát Vip majitelovi serveru.",
      });
      return;
    }

    const targetUserRolePosition = getTargetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        content: "Nemůžete dát Vip uživatelovi se stejnou nebo vyšší rolí.",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        content:
          "Nemůžu dát Vip uživatelovi se stejnou nebo vyšší rolí než já.",
      });
      return;
    }

    const role = interaction.guild.roles.cache.find(
      (r) => r.name === "💎 VIP člen"
    );

    if (getTargetUser.roles.cache.some((role) => role.name === "💎 VIP člen")) {
      await interaction.editReply({
        content: "Tento uživatel již má VIP status.",
      });
      return;
    }

    try {
      await getTargetUser.roles.add(role);
      await getTargetUser.send(`Obrdžel/a jsi vip za ${message}! 🎉`);
      await interaction.editReply({
        content: `Vip bylo předáno uživateli <@${targetUserId}> za ${message}`,
      });
    } catch (error) {
      console.log(`There was an error while running add-vip: ${error}`);
    }
  },
};
