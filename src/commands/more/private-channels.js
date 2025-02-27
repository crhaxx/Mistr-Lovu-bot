const {
  Client,
  Intraction,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  //deleted: true,
  name: "private-channels",
  description: "Udělá kanály soukromé",
  // devOnly: Boolean,
  // testOnly: Boolean,

  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  /**
   *
   * @param {Client} client
   * @param {Intraction} interaction
   */

  callback: async (client, interaction) => {
    const discordServer = client.guilds.cache.get("1338286347831476224");
    const channels = discordServer?.channels
      ? JSON.parse(JSON.stringify(discordServer.channels)).guild.channels
      : [];

    for (i = 0; i < channels.length; i++) {
      channel = interaction.guild.channels.cache.get(channels[i]);
      channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        ViewChannel: true,
        SendMessages: false,
      });
    }

    interaction.reply({
      content: "Přidání kanálů bylo úspěšné!",
      ephemeral: true,
    });
  },
};
