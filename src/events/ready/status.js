const { ActivityType } = require("discord.js");

module.exports = (client) => {
  let status = [
    {
      name: "chytám ryby",
      type: ActivityType.Playing,
    },
    {
      name: "vaše zprávy",
      type: ActivityType.Watching,
    },
    {
      name: "si s rybářským prutem",
      type: ActivityType.Playing,
    },
    {
      name: "simulátor rybaření",
      type: ActivityType.Playing,
    },
    {
      name: "šplouchání vody",
      type: ActivityType.Listening,
    },
    {
      name: "rady zkušených rybářů",
      type: ActivityType.Listening,
    },
    {
      name: "tiché bublání rybníka",
      type: ActivityType.Listening,
    },
    {
      name: "jak ryby berou",
      type: ActivityType.Watching,
    },
    {
      name: "splávek na hladině",
      type: ActivityType.Watching,
    },
    {
      name: "mistra v nahazování",
      type: ActivityType.Watching,
    },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
    console.log("Status changed to: " + status[random].name);
  }, 30000);
};
