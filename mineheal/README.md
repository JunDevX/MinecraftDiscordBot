# Aternos Status Bot

Discord-бот на Node.js:

1. Каждые 10 минут (настраивается) пишет в канал `STATUS_CHANNEL_ID` Embed со статусом
   Minecraft-сервера — 🟢 зелёный, если сервер онлайн и отвечает на пинг, 🔴 красный,
   если выключен / на технических работах (Aternos не отвечает на пинг в обоих этих случаях,
   отличить их по одному пингу нельзя — сервер либо доступен, либо нет).
2. (Опционально, включается флагом) заходит на сервер отдельным "игроком" с ником `DISCORD`
   через [mineflayer](https://github.com/PrismarineJS/mineflayer), выполняет
   `/register discordplayer discordplayer`, затем `/login discordplayer`.
3. Слушает игровой чат и при получении кем-либо достижения пишет в канал
   `ACHIEVEMENT_CHANNEL_ID`: `Игрок "ник" получил достижение "название"`, с картинкой-карточкой
   достижения.

## Установка

```bash
npm install
cp .env.example .env
```

Заполните `.env`:

- `DISCORD_TOKEN` — токен бота из [Discord Developer Portal](https://discord.com/developers/applications)
- `STATUS_CHANNEL_ID`, `ACHIEVEMENT_CHANNEL_ID` — уже подставлены под ваши каналы
- `MC_HOST`, `MC_PORT` — уже подставлены под `mineheal.aternos.me:22829`
- `ENABLE_MC_BOT=true`, если нужен бот-игрок

В Discord Developer Portal у приложения нужен только Bot Token и права
`Send Messages`, `Embed Links` в нужных каналах (Message Content Intent не требуется —
бот ничего не читает из Discord-чата).

## Запуск

```bash
npm start
```

## О боте-игроке (mineflayer)

- Работает в оффлайн/пиратском режиме (без официального аккаунта Mojang) — это ок для
  Aternos-серверов, у которых `online-mode=false`.
- `/register` и `/login` рассчитаны на плагины вида AuthMe. Если на сервере стоит
  другой плагин авторизации или её нет вообще — отредактируйте команды в
  `src/mcBot.js` (функция `createBot`) или уберите их, если авторизация не нужна.
- При разрыве соединения бот сам переподключается через 30 секунд.
- Распознавание достижений сделано через регулярные выражения на типовые
  сообщения ванильного чата (`... has made the advancement [...]` и т.п.).
  Если у вас на сервере кастомный формат сообщений о достижениях (другой язык,
  другой плагин продвижений) — добавьте свой шаблон в массив `ACHIEVEMENT_PATTERNS`
  в `src/mcBot.js`.

## О картинке достижения

У `minecraft-inside.ru/achievements` нет опубликованного API для генерации картинки
по прямой ссылке — это обычная веб-форма с JS-рендером на canvas, автоматически
дёрнуть её без браузера/Puppeteer нельзя. Вместо этого в коде используется открытый
аналогичный генератор с публичным GET API — [mcgen](https://github.com/menzerath/mcgen)
(`https://mcgen.menzerath.eu`), который рисует такую же карточку "Advancement Made!".

Если хотите именно рендер с minecraft-inside.ru, два варианта:
1. Написать отдельный скрипт на Puppeteer, который открывает их страницу,
   подставляет текст в поля формы и делает скриншот canvas — но это хрупко и
   ломается при любом изменении вёрстки сайта.
2. Оставить как есть (mcgen) — картинка получается визуально очень похожей.

Если картинка не нужна вообще — удалите строки с `buildAchievementImageUrl` /
`embed.setImage` в `src/mcBot.js`.

## Структура проекта

```
src/
  index.js           — точка входа, инициализация Discord-клиента
  statusChecker.js    — пинг сервера раз в N минут + отправка Embed
  mcBot.js            — mineflayer-бот: вход, регистрация, отслеживание достижений
.env.example
package.json
```
