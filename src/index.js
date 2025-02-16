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

// let status = [
//   {
//     name: "Chytám ryby",
//     type: ActivityType.Playing,
//   },
//   {
//     name: "Vaše zprávy",
//     type: ActivityType.Watching,
//   },
// ];

// client.on("ready", (c) => {
//   console.log(`✅ ${c.user.tag} is online`);

//   setInterval(() => {
//     let random = Math.floor(Math.random() * status.length);
//     client.user.setActivity(status[random]);
//     console.log("Status changed to: " + status[random].name);
//   }, 30000);
// });

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    await interaction.deferReply({ ephemeral: true });

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      interaction.editReply({ content: "Couldn't find that role" });
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);

    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.editReply({ content: "Role removed" });
      return;
    }
    await interaction.member.roles.add(role);
    await interaction.editReply({ content: "Role added" });
    return;
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
