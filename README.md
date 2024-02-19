# Telegram bot for Special Economic Zone

# Installation

## Setup environmental variables:

```bash
BOT_API=<YOUR TELEGRAM BOT TOKEN>
DATABASE_PASSWORD=<YOUR DATABASE PASSWORD>
DATABASE_URL=postgres://postgres:${DATABASE_PASSWORD}@db:5432/tg-bot
```

## Setup docker-copmose:

If necessary, you can change the external ports by modifying the left value for both the database and server.
For example, if you have already started another database server on port 5432, you could change it as "5432:5432" -> "5436:5432".
Simply select a free port.

```bash
ports:
      - '5432:5432'
```
to 
```bash
ports:
      - '5436:5432'
```

## Build and start

```bash
$ docker-compose up --build
```

## If already built

```bash
$ docker-compose up
```
