const { testServer } = require("../../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getAplicationCommands = require("../../utils/getAplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  const localCommands = getLocalCommands();

  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getAplicationCommands(client, testServer);

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`Updated command ${name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(`Skipping registering command ${name}`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`Registered command ${name}`);
      }
    }
  } catch (error) {
    console.log("There was an error: " + error);
  }
};
