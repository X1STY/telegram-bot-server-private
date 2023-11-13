import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AdminPanelMenu, MainMenu } from '../markups';
import { findUserById } from '../bot.service';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const AdminPanel = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  prisma: PrismaClient
) => {
  const user = await findUserById(msg.from.id, prisma);
  //await registerNewUser(msg, prisma);
  if (msg.text === '/admin') {
    if (user && user.role !== 'ADMIN') {
      await registerUserAsAdmin(bot, msg, prisma);
    } else {
      await bot.sendMessage(msg.from.id, 'Вы авторизированы как администратор', {
        reply_markup: AdminPanelMenu()
      });
    }
  }
};

const registerUserAsAdmin = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  prisma: PrismaClient
) => {
  await bot.sendMessage(msg.from.id, 'Введите пароль доступа в админ панель');
  const responseMsg = await ReplayQuestionCallback(bot, msg);

  if (responseMsg.text !== process.env.ADMIN_PASSWORD) {
    await bot.sendMessage(msg.from.id, 'Неверный пароль!', {
      reply_markup: MainMenu()
    });
    return;
  }

  await bot.sendMessage(msg.from.id, 'Успешная авторизация!', {
    reply_markup: AdminPanelMenu()
  });

  await prisma.user.update({
    data: {
      role: 'ADMIN'
    },
    where: {
      telegramId: msg.from.id
    }
  });
};
