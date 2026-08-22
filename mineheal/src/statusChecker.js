const { EmbedBuilder } = require('discord.js');
const mc = require('minecraft-server-util');

const STATUS_CHANNEL_ID = process.env.STATUS_CHANNEL_ID;
const MC_HOST = process.env.MC_HOST;
const MC_PORT = parseInt(process.env.MC_PORT, 10);
const INTERVAL_MS = (parseInt(process.env.STATUS_INTERVAL_MINUTES, 10) || 10) * 60 * 1000;

/**
 * Проверяет статус сервера и присылает Embed в канал статуса.
 * Зелёный Embed = сервер включён и отвечает на пинг.
 * Красный Embed = сервер выключен либо на технических работах
 * (Aternos не отвечает на пинг, если он не запущен).
 */
async function checkServerStatus(client) {
  const channel = await client.channels.fetch(STATUS_CHANNEL_ID).catch((err) => {
    console.error(`[Статус] Не удалось получить канал ${STATUS_CHANNEL_ID}:`, err.message);
    return null;
  });
  if (!channel) return;

  let embed;

  try {
    const status = await mc.status(MC_HOST, MC_PORT, {
      timeout: 5000,
      enableSRV: true,
    });

    embed = new EmbedBuilder()
      .setColor(0x2ecc71) // зелёный
      .setTitle('🟢 Сервер включён')
      .addFields(
        { name: 'Адрес', value: `\`${MC_HOST}:${MC_PORT}\``, inline: true },
        { name: 'Версия', value: status.version?.name ?? 'неизвестно', inline: true },
        {
          name: 'Игроков онлайн',
          value: `${status.players.online} / ${status.players.max}`,
          inline: true,
        },
      )
      .setFooter({ text: 'Проверка статуса' })
      .setTimestamp();

    if (status.favicon) {
      embed.setThumbnail(status.favicon);
    }
  } catch (err) {
    // Сервер не ответил на пинг за отведённое время — считаем,
    // что он выключен или ещё не поднялся после старта (тех. работы)
    embed = new EmbedBuilder()
      .setColor(0xe74c3c) // красный
      .setTitle('🔴 Сервер выключен / на технических работах')
      .addFields({ name: 'Адрес', value: `\`${MC_HOST}:${MC_PORT}\``, inline: true })
      .setFooter({ text: 'Проверка статуса' })
      .setTimestamp();
  }

  await channel.send({ embeds: [embed] }).catch((err) => {
    console.error('[Статус] Не удалось отправить сообщение:', err.message);
  });
}

function startStatusChecker(client) {
  checkServerStatus(client); // первая проверка сразу при старте
  setInterval(() => checkServerStatus(client), INTERVAL_MS);
  console.log(`[Статус] Проверка каждые ${INTERVAL_MS / 60000} мин. в канале ${STATUS_CHANNEL_ID}`);
}

module.exports = { startStatusChecker, checkServerStatus };
