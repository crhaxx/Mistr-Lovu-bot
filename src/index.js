require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

eventHandler(client);

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    await interaction.deferReply({ ephemeral: true });

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      interaction.editReply({
        content: `Role <@&${role.id}> byla smazána`,
      });
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);

    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.editReply({
        content: `Oddělali jste si roli: <@&${role.id}>`,
      });
      return;
    }
    await interaction.member.roles.add(role);
    await interaction.editReply({
      content: `Přidali jste si roli: <@&${role.id}>`,
    });
    return;
  } catch (error) {
    console.log(error);
  }
});

client.on("guildMemberAdd", (guildMember) => {
  const welcomeMessage = `Zdareeec ${guildMember.user}! Vítej na našem Discord serveru!`;

  client.channels
    .fetch("1338286348737708118")
    .then((channel) => channel.send(welcomeMessage).catch(() => {}));
});

client.login(process.env.TOKEN);
