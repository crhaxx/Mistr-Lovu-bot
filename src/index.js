require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
  ChannelType,
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
  const embed = new EmbedBuilder()
    .setTitle(
      `Zdareec ${guildMember.user.tag}, vítej na ${guildMember.guild.name}`
    )
    .setDescription(
      `📜 Přivítání nového rybáře <#1338514233511514144>.
👋 Vítej na serveru ${guildMember.guild.name}! 🎣🐟
Jsme komunita nadšených rybářů, kde můžeš sdílet své úlovky, získávat tipy a bavit se s ostatními!

🔹 Než začneš, přečti si pravidla v kanálu <#1338286348737708114>.
🔹 Vyber si svou rybářskou roli v <#1338516980981829742>.
🔹 Přidej se k diskuzím v <#1338286348737708118> a pochlub se svými úlovky v <#1338286348737708119>!`
    )
    .addFields({
      name: "🎯 Jak začít?",
      value: `✅ Klikni na ✅ v kanálu <#1338286348737708114> pro plný přístup k serveru.
✅ Vyber si typ rybáře v <#1338516980981829742> (např. 🎣 Kaprař, 🐠 Feeder specialista).
✅ Připoj se k hlasovým kanálům a pokecáme o rybaření! Jsi ${guildMember.guild.memberCount} člen tohoto serveru!`,
    })
    .setFooter({
      text: "Těšíme se na tvoje úlovky a příběhy! Tight lines! 🎣🔥",
    });

  const welcomeMessage = `Zdareeec ${guildMember.user}! Vítej na našem Discord serveru!`;

  client.channels
    .fetch("1344775154428809217")
    .then((channel) => channel.send(welcomeMessage).catch(() => {}));

  client.channels
    .fetch("1344775149257490482")
    .then((channel) => channel.send({ embeds: [embed] }).catch(() => {}));
});

client.on("guildMemberRemove", (guildMember) => {
  const leaveMessage = `${guildMember.user} nás opustil! 😔`;

  client.channels
    .fetch("1344775149257490482")
    .then((channel) => channel.send(leaveMessage).catch(() => {}));
});

client.login(process.env.TOKEN);
