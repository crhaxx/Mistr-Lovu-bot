![Banner](https://i.postimg.cc/mk9WjqJY/Mistr-Lovu-Bot-1.png)
![GitHub forks](https://img.shields.io/github/forks/crhaxx/Mistr-Lovu-bot)
![GitHub Repo stars](https://img.shields.io/github/stars/crhaxx/Mistr-Lovu-bot)
![GitHub top language](https://img.shields.io/github/languages/top/crhaxx/Mistr-Lovu-bot)
![GitHub last commit](https://img.shields.io/github/last-commit/crhaxx/Mistr-Lovu-bot)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/crhaxx/Mistr-Lovu-bot)

# 📝 How to Build

To build the packages, follow these steps:

```bash
# Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

# Ensure Nodejs is installed
# Visit https://nodejs.org/en to download Nodejs

# Ensure Git is installed
# Visit https://git-scm.com to download and install console Git if not already installed

# Clone the repository
git clone https://github.com/crhaxx/Mistr-Lovu-bot.git

# Navigate to the project directory
cd Mistr-Lovu-bot

# Install necessary libraries
npm install discord.js dotenv ms pretty-ms
```

# 📄 Install the necessary tools

Run following command in your terminal to check the installed version of nodemon on your computer

```bash
nodemon -v
```

If your nodemon version is low or you do not have nodemon installed yet, run the following command in your terminal to install nodemon globally

```bash
npm install -g nodemon
```

# ⚙️ Customize your settings

Create an `.env` file and set the value of **TOKEN** (bot token)

```bash
TOKEN = 123
```

Set **testServer**, **clientId**, **devs**, **reactionRolesChannelID** in the `config.json` file

```bash
{
  "testServer": "791366919319846912",
  "clientId": "1340342256988721315",
  "devs": ["790862986813898782"]
  "reactionRolesChannelID": "1338516980981829742"
}
```

# 🔑 How to start

In the terminal run the following command

```bash
nodemon
```
