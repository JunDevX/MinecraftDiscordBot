const mineflayer = require('mineflayer');
const { EmbedBuilder } = require('discord.js');

const MC_HOST = process.env.MC_HOST;
const MC_PORT = parseInt(process.env.MC_PORT, 10);
const MC_VERSION = process.env.MC_VERSION || false; // false = автоопределение
const BOT_USERNAME = process.env.MC_BOT_USERNAME || 'DISCORD';
const BOT_PASSWORD = process.env.MC_BOT_PASSWORD || 'discordplayer';
const ACHIEVEMENT_CHANNEL_ID = process.env.ACHIEVEMENT_CHANNEL_ID;

const RECONNECT_DELAY_MS = 30_000;

// Разные сервера/плагины (AuthMe и т.п.) немного по-разному формулируют
// сообщения о достижениях/продвижениях в чате. Ловим самые частые варианты.
const ACHIEVEMENT_PATTERNS = [
  /^(\w+) has made the advancement \[(.+)\]$/i,
  /^(\w+) has completed the challenge \[(.+)\]$/i,
  /^(\w+) has just earned the achievement \[(.+)\]$/i,
  /^(\w+) получил достижение «(.+)»$/i,
  /^(\w+) выполнил задание «(.+)»$/i,
];

let reconnectTimer = null;

function createBot(discordClient) {
  console.log('[MC-бот] Подключение к серверу...');

  const bot = mineflayer.createBot({
    host: MC_HOST,
    port: MC_PORT,
    username: BOT_USERNAME,
    version: MC_VERSION,
    auth: 'offline', // оффлайн/пиратский режим, регистрация идёт через /register
  });

  bot.once('spawn', () => {
    console.log('[MC-бот] Заспавнился, пробуем зарегистрироваться / войти...');
    // Небольшая задержка перед командами — даём миру и чату проинициализироваться
    setTimeout(() => {
      bot.chat(`/register ${BOT_PASSWORD} ${BOT_PASSWORD}`);
    }, 1500);

    setTimeout(() => {
      bot.chat(`/login ${BOT_PASSWORD}`);
    }, 3500);
  });

  bot.on('message', async (jsonMsg) => {
    const text = jsonMsg.toString().trim();
    if (!text) return;

    for (const pattern of ACHIEVEMENT_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const [, player, achievement] = match;
        await postAchievement(discordClient, player, achievement);
        break;
      }
    }
  });

  bot.on('kicked', (reason) => {
    console.warn('[MC-бот] Бот кикнут с сервера:', reason);
  });

  bot.on('error', (err) => {
    console.error('[MC-бот] Ошибка соединения:', err.message);
  });

  bot.on('end', () => {
    console.warn(`[MC-бот] Соединение закрыто. Переподключение через ${RECONNECT_DELAY_MS / 1000}с...`);
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => createBot(discordClient), RECONNECT_DELAY_MS);
  });

  return bot;
}

async function postAchievement(discordClient, player, achievement) {
  const channel = await discordClient.channels.fetch(ACHIEVEMENT_CHANNEL_ID).catch((err) => {
    console.error(`[Достижения] Не удалось получить канал ${ACHIEVEMENT_CHANNEL_ID}:`, err.message);
    return null;
  });
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setDescription(`Игрок "${player}" получил достижение "${achievement}"`)
    .setTimestamp();

  const imageUrl = buildAchievementImageUrl(achievement);
  if (imageUrl) embed.setImage(imageUrl);

  await channel.send({ embeds: [embed] }).catch((err) => {
    console.error('[Достижения] Не удалось отправить сообщение:', err.message);
  });
}

/**
 * У minecraft-inside.ru нет задокументированного публичного API для генерации
 * картинки достижения напрямую по ссылке (это обычная веб-форма, а не эндпоинт),
 * поэтому автоматически подставлять её картинки без headless-браузера нельзя.
 * Вместо этого используем открытый аналогичный генератор с публичным GET API
 * (mcgen, https://github.com/menzerath/mcgen) — он рисует такую же карточку
 * "Advancement Made!" с нужным текстом. Если картинка не нужна — верните null.
 */
function buildAchievementImageUrl(title) {
  const encodedTitle = encodeURIComponent(title);
  return `https://mcgen.menzerath.eu/api/v1/achievement?background=grass&title=Advancement+Made%21&text=${encodedTitle}`;
}

function startMinecraftBot(discordClient) {
  if (!ACHIEVEMENT_CHANNEL_ID) {
    console.warn('[MC-бот] ACHIEVEMENT_CHANNEL_ID не задан, отслеживание достижений будет молчать.');
  }
  createBot(discordClient);
}

module.exports = { startMinecraftBot };
