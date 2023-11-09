import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { MainMenu, RegisteredUserMenu } from '../markups';
import { findUserById } from '../bot.service';
import { MyContacts } from './MyContacts/MyContacts';
import { SendAProblem } from './SendAProblem/SendAProblem';
import { InnovationProposal } from './InnovationProposal/InnovationProposal';
import { BookHallResident } from './BookHallResident/BookHallResident';
import { MyApplications } from './MyApplications/MyApplications';

export const PreRegistered = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  prisma: PrismaClient
) => {
  const user = await prisma.user.findFirst({
    where: {
      telegramId: msg.from.id
    }
  });
  if (user.role === 'UNREGISTERED') {
    await bot.sendMessage(msg.chat.id, 'Вы не заререстрированны! Пройдите регистрацию.', {
      reply_markup: MainMenu()
    });
    return;
  }

  const call: TelegramBot.CallbackQuery = {
    id: ' ',
    chat_instance: msg.chat.id.toString(),
    data: 'registered',
    from: msg.from
  };
  Registered(bot, call, prisma);
};

export const Registered = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'registered') {
    MyContacts(bot, call, prisma);
    SendAProblem(bot, call, prisma);
    InnovationProposal(bot, call, prisma);
    BookHallResident(bot, call, prisma);
    MyApplications(bot, call, prisma);

    return;
  }

  const chatId = call.from.id || call.chat_instance;
  if (call.id !== ' ') {
    await bot.answerCallbackQuery(call.id);
    await bot.deleteMessage(chatId, call.message.message_id);
  }
  const user = await findUserById(call.from.id, prisma);
  await bot.sendMessage(
    chatId,
    'Добро пожаловать! Вы можете воспользоваться меню для зарегестрированных пользователей',
    {
      reply_markup: RegisteredUserMenu(user.role)
    }
  );
  return;
};
