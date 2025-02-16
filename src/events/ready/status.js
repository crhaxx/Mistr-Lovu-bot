const { ActivityType } = require("discord.js");

module.exports = (client) => {
  let status = [
    {
      name: "Chytám ryby",
      type: ActivityType.Playing,
    },
    {
      name: "Vaše zprávy",
      type: ActivityType.Watching,
    },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
    console.log("Status changed to: " + status[random].name);
  }, 30000);
};
