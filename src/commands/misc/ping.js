module.exports = {
  name: "ping",
  description: "Ukáže ping robota",
  // devOnly: Boolean,
  // testOnly: true,
  // options: Object[],
  // deleted: Boolean,

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(`Client: ${ping}ms | WebSocket: ${client.ws.ping}ms`);
  },
};
