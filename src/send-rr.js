require("dotenv").config();
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const { reactionRolesChannelID } = require("../config.json");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const roles_fish_types = [
  {
    id: "1338464372523270274",
    label: "Kaprař",
    emoji: "🐟",
  },
  {
    id: "1338464560209985568",
    label: "Sumcař",
    emoji: "🐋",
  },
  {
    id: "1338573163839230006",
    label: "Lovec dravců",
    emoji: "🦈",
  },
];

const roles_skills = [
  {
    id: "1338499316146372740",
    label: "Začatečník",
    emoji: "🛡️",
  },
  {
    id: "1338499515426144357",
    label: "Zkušený rybář",
    emoji: "🏆",
  },
];

const roles_skill = [
  {
    id: "1338464552416972841",
    label: "Feeder specialista",
    emoji: "🤟",
  },
  {
    id: "1338464557353406496",
    label: "Plavaná specialista",
    emoji: "👀",
  },
  {
    id: "1338464804318220309",
    label: "Vláčka specialista",
    emoji: "⚓",
  },
];

client.on("ready", async (c) => {
  try {
    const channel = await client.channels.cache.get(reactionRolesChannelID);
    if (!channel) return;

    const row = new ActionRowBuilder();
    const row2 = new ActionRowBuilder();
    const row3 = new ActionRowBuilder();

    roles_skill.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(role.emoji)
      );
    });

    roles_fish_types.forEach((role) => {
      row2.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(role.emoji)
      );
    });

    roles_skills.forEach((role) => {
      row3.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(role.emoji)
      );
    });

    const embed = new EmbedBuilder()
      .setTitle("Vyber si role")
      .setDescription("\n\n")
      .setFooter({
        text: "Kliknutím na tlačítko si přidáte nebo odeberete roli",
      })
      .addFields({
        name: "Skill",
        value:
          "- `🤟 Feeder specialista`\n- `👀 Plavaná specialista`\n- `⚓ Vláčka specialista`",
      })
      .addFields({
        name: "Typ ryb",
        value: "- `🐟 Kaprař`\n- `🐋 Sumcař`\n- `🦈 Lovec dravců`",
      })
      .addFields({
        name: "Zkušenost",
        value: "- `🛡️ Začatečník`\n- `🏆 Zkušený rybář`",
      });

    await channel.send({
      embeds: [embed],
      components: [row, row2, row3],
    });
    process.exit();
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
