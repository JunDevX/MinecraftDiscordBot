# MinecraftDiscordBot
### Русский [English](https://github.com/JunDevX/MinecraftDiscordBot/blob/main/README-en.md)
# Как использовать?
1. Установите ZIP из корня репозитория или из релизов
2. Выполните ряд команд
```Bash
npm install
copy .env.example .env
start .env
```
3. Отредактируйте следующие значения
```
# Адрес и порт Minecraft-сервера
MC_HOST=Your server IP
MC_PORT=Your MC server port
```
3.1 Если есть плагин на авторизаци / регистрацию `AuthMeReload`
```
# Данные для бота-игрока (используются в /register и /login,
# актуально для серверов с AuthMe/подобными плагинами)
MC_BOT_USERNAME=DISCORD
MC_BOT_PASSWORD=discordplayer
```
3.2 укажите майнкрафт версию сервера
```
# (опционально) версия протокола Minecraft, если авто-определение не работает
# например: 1.20.4
MC_VERSION=version your MC server
```
3.3
```
# Токен вашего Discord-бота (Discord Developer Portal -> Bot -> Token)
DISCORD_TOKEN=Discord BOT Token
```
3.4 Включите самого бота
```
# Включить ли бота-игрока (mineflayer), который заходит на сервер
# и следит за достижениями в чате. true / false
ENABLE_MC_BOT=изменить значение на true
```
4. Далее в терминале выполните
```Bash
npm start
```
5. Изменить на ID ваших дискорд чатах
```
# Канал, куда будет писаться статус сервера (раз в 10 минут)
STATUS_CHANNEL_ID=1538987950920966256

# Канал, куда будут писаться уведомления о полученных достижениях
ACHIEVEMENT_CHANNEL_ID=1537816129299288154
```

## Что делает бот?
Данный скрипт подключает на ваш сервер игрока с (по умолчанию) ником DISCORD (менять в `MC_BOT_USERNAME=DISCORD`)
Если кто то получает достижение генерирует картинку достижения и кидает в указанный чат `ACHIEVEMENT_CHANNEL_ID` в Discord, так же пишет о статусе майнкрафт сервера и отправляет информацию в `STATUS_CHANNEL_ID` раз в 10 минут
