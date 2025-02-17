const { Client, Interaction } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "uptime",
  description: "Ukáže jak dlouho je robot vzhůru",

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: (client, interaction) => {
    const msDuration = ms(client.uptime);
    interaction.reply(`Bot je online: ${msDuration}`);
  },
};
