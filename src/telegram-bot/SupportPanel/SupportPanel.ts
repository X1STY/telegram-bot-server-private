import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { SupportPageMenu } from '../markups';
import { CheckUsersApplication } from './CheckUsersApplication/CheckUsersApplication';

export const PreSupport = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  prisma: PrismaClient
) => {
  const user = await prisma.user.findFirst({
    where: {
      telegramId: msg.from.id
    }
  });
  if (user.role !== 'SUPPORT') {
    return;
  }
  const call: TelegramBot.CallbackQuery = {
    id: ' ',
    chat_instance: msg.chat.id.toString(),
    data: 'support',
    from: msg.from
  };
  SupportPage(bot, call, prisma);
};

export const SupportPage = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'support') {
    CheckUsersApplication(bot, call, prisma);
    return;
  }
  const user = await prisma.user.findFirst({
    where: {
      telegramId: call.from.id
    }
  });
  if (user.role !== 'SUPPORT') {
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
    'Меню агента поддержки. У вас есть доступ к обработке заявок, оставленных другими пользователями',
    {
      reply_markup: SupportPageMenu()
    }
  );

  return;
};
