const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = {
  name: "create-embed",
  description: "Vytvoří embed zprávu",
  options: [
    {
      name: "kanal",
      description: "Kanál embed zprávy",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    },
    {
      name: "nadpis",
      description: "Nadpis embed zprávy (title)",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "dulezite",
      description:
        "Je zpráva důležitá (pokud ano bude zpráva mít červený okraj)",
      required: true,
      type: ApplicationCommandOptionType.Boolean,
    },
    {
      name: "zprava",
      description: "Zpráva před embed zprávou (text)",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "autor",
      description: "Autor embed zprávy (author)",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "popis",
      description: "Popis embed zprávy (description)",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],

  callback: async (client, interaction) => {
    try {
      const kanal = interaction.options.get("kanal").value;
      const nadpis = interaction.options.get("nadpis").value;
      const dulezite = interaction.options.get("dulezite").value;
      const popis = interaction.options.get("popis")?.value || "no";
      const autor = interaction.options.get("autor")?.value || "no";
      const zprava = interaction.options.get("zprava")?.value || "";

      const channel = await client.channels.cache.get(kanal);

      const embed = new EmbedBuilder()
        .setTitle(nadpis)
        .setFooter({ text: `Zprávu poslal ${interaction.user.tag}` });
      if (autor != "no") embed.setAuthor({ name: autor });
      if (popis != "no") embed.setDescription(popis);

      dulezite ? embed.setColor("Red") : embed.setColor("Blue");

      await channel.send({
        embeds: [embed],
        content: zprava,
      });

      interaction.reply(`Embed zpráva byla poslána do <#${kanal}>`);
    } catch (error) {
      console.log(error);
    }
  },
};
