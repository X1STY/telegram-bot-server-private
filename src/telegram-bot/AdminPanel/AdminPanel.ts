import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { findUserById } from '../bot.service';
import { AdminPanelMenu } from '../markups';

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
  await bot.sendMessage(
    chatId,
    'Меню администратора. Вы можете сделать рассылку информации, редактировать агентов поддержки и изменять содержание постов',
    {
      reply_markup: AdminPanelMenu()
    }
  );

  return;
};
