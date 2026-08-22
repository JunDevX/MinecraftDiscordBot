require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { startStatusChecker } = require('./statusChecker');
const { startMinecraftBot } = require('./mcBot');

const REQUIRED_ENV = ['DISCORD_TOKEN', 'STATUS_CHANNEL_ID', 'MC_HOST', 'MC_PORT'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Не заданы обязательные переменные окружения: ${missing.join(', ')}`);
  console.error('Скопируйте .env.example в .env и заполните значения.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
  console.log(`Discord-бот запущен как ${client.user.tag}`);

  startStatusChecker(client);

  if (process.env.ENABLE_MC_BOT === 'true') {
    startMinecraftBot(client);
  } else {
    console.log('[MC-бот] Отключён (ENABLE_MC_BOT=false в .env)');
  }
});

client.login(process.env.DISCORD_TOKEN);
