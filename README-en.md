# MinecraftDiscordBot
### [Russian](https://github.com/JunDevX/MinecraftDiscordBot/blob/main/README.md) English
# How to use it?
1. Install the ZIP file from the repository root or from the releases
2. Run the following commands
```Bash
npm install
copy .env.example .env
start .env
```
3. Edit the following values
```
# Minecraft server address and port
MC_HOST=Your server IP
MC_PORT=Your MC server port
```
3.1 If you have the `AuthMeReload` authentication/registration plugin
```
# Data for the bot player (used in /register and /login,
# relevant for servers with AuthMe or similar plugins)
MC_BOT_USERNAME=DISCORD
MC_BOT_PASSWORD=discordplayer
```
3.2 Specify the Minecraft version of the server
```
# (optional) Minecraft protocol version, if auto-detection doesn’t work
# for example: 1.20.4
MC_VERSION=version of your MC server
```
3.3
```
# Your Discord bot’s token (Discord Developer Portal -> Bot -> Token)
DISCORD_TOKEN=Discord BOT Token
```
4. Next, run the following in the terminal
```Bash
npm start
```
5. Replace with the IDs of your Discord channels
```
# Channel where the server status will be posted (every 10 minutes)
STATUS_CHANNEL_ID=1538987950920966256

# Channel where notifications about earned achievements will be posted
ACHIEVEMENT_CHANNEL_ID=1537816129299288154
```

## What does the bot do?
This script connects a player to your server with the nickname DISCORD (by default; change this in `MC_BOT_USERNAME=DISCORD`)
If someone earns an achievement, it generates an achievement image and posts it to the specified chat `ACHIEVEMENT_CHANNEL_ID` in Discord, t

Translated with DeepL.com (free version)
