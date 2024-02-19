import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { MainMenu, RegisteredUserMenu } from '../markups';
import { botMessages, findUserById, logger } from '../bot.service';
import { MyContacts } from './MyContacts/MyContacts';
import { SendAProblem } from './SendAProblem/SendAProblem';
import { InnovationProposal } from './InnovationProposal/InnovationProposal';
import { BookHallResident } from './BookHallResident/BookHallResident';
import { MyApplications } from './MyApplications/MyApplications';
import { ApplyToSupport } from './ApplyToSupport/ApplyToSupport';

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
    await bot.sendMessage(msg.chat.id, botMessages['NonRegisteredError'].message, {
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
    try {
      await MyContacts(bot, call, prisma);
      await SendAProblem(bot, call, prisma);
      await InnovationProposal(bot, call, prisma);
      await BookHallResident(bot, call, prisma);
      await MyApplications(bot, call, prisma);
      await ApplyToSupport(bot, call, prisma);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);

      return;
    }

    return;
  }

  const chatId = call.from.id || call.chat_instance;
  if (call.id !== ' ') {
    await bot.answerCallbackQuery(call.id);
    await bot.deleteMessage(chatId, call.message.message_id);
  }
  const user = await findUserById(call.from.id, prisma);
  await bot.sendMessage(chatId, botMessages['RegisteredMenuMessage'].message, {
    reply_markup: RegisteredUserMenu(user.role),
    parse_mode: 'Markdown'
  });
  return;
};
