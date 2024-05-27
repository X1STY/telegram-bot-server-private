import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { botMessages, findUserById } from '../bot.service';
import { AdminPanelMenu } from '../markups';
import { ManageSupport } from './ManageSupport/ManageSupport';
import { ChooseSupport } from './ChooseSupport/ChooseSupport';
import { SendMessageToAllUsers } from './SendMessageToAllUsers/SendMessageToAllUsers';
import { ManageMessages } from './ManageMessages/ManageMessages';
import { ManageHalls } from './ManageHalls/ManageHalls';
import { handleError } from '@/utils';

export const PreAdmin = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  prisma: PrismaClient
) => {
  const user = await prisma.user.findFirst({
    where: {
      telegramId: msg.from.id
    }
  });
  if (user.role !== 'ADMIN') {
    return;
  }
  const call: TelegramBot.CallbackQuery = {
    id: ' ',
    chat_instance: msg.chat.id.toString(),
    data: 'admin',
    from: msg.from
  };
  AdminPage(bot, call, prisma);
};

export const AdminPage = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  const user = await findUserById(call.from.id, prisma);

  if (call.data !== 'admin') {
    try {
      await ManageSupport(bot, call, prisma);
      await ChooseSupport(bot, call, prisma);
      await SendMessageToAllUsers(bot, call, prisma);
      await ManageMessages(bot, call);
      await ManageHalls(bot, call, prisma);
    } catch (error) {
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);

      return;
    }

    return;
  }
  if (user.role !== 'ADMIN') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  const chatId = call.from.id || call.chat_instance;
  if (call.id !== ' ') {
    await bot.answerCallbackQuery(call.id);
    await bot.deleteMessage(chatId, call.message.message_id);
  }
  await bot.sendMessage(chatId, botMessages['AdminPanelMessage'].message, {
    reply_markup: AdminPanelMenu()
  });

  return;
};
