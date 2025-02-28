const { Client, Intraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
  //deleted: true,
  name: "set-public-channels",
  description: "Nastaví veřejné kanály",
  // devOnly: Boolean,
  // testOnly: Boolean,

  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],

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
      if (
        channels[i] == "1344775148212850750" ||
        channels[i] == "1339151527473971342" ||
        channels[i] == "1344783603141181440" ||
        channels[i] == "1344768980836945920"
      )
        continue;
      channel = interaction.guild.channels.cache.get(channels[i]);
      channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        SendMessages: false,
        ViewChannel: true,
        ReadMessageHistory: true,
        ManageMessages: false,
        ManageRoles: false,
        ManageChannels: false,
        EmbedLinks: false,
        AttachFiles: false,
        UseExternalEmojis: true,
        UseExternalStickers: true,
        UseExternalSounds: true,
        AddReactions: true,
        Connect: true,
        Speak: true,
        Stream: true,
        MentionEveryone: false,
        ChangeNickname: false,
        ManageNicknames: false,
        ManageWebhooks: false,
        SendMessagesInThreads: false,
        ManageThreads: false,
        CreatePublicThreads: false,
        CreatePrivateThreads: false,
        UseExternalApps: false,
      });
    }

    interaction.reply({
      content: "Kanály byly úspěšně nastaveny!",
      ephemeral: true,
    });
  },
};
