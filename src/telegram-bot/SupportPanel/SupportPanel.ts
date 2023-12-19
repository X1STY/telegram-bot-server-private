import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { SupportPageMenu } from '../markups';
import { CheckUsersApplication } from './CheckUsersApplication/CheckUsersApplication';
import { botMessages, findUserById, logger } from '../bot.service';
import { GenerateStatistic } from './GenerateStatistic/GenerateStatistic';

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
  const user = await findUserById(call.from.id, prisma);

  if (call.data !== 'support') {
    try {
      await CheckUsersApplication(bot, call, prisma);
      await GenerateStatistic(bot, call, prisma);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);

      return;
    }

    return;
  }
  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  const chatId = call.from.id || call.chat_instance;
  if (call.id !== ' ') {
    await bot.answerCallbackQuery(call.id);
    await bot.deleteMessage(chatId, call.message.message_id);
  }
  await bot.sendMessage(chatId, botMessages['SupportMenuMessage'].message, {
    reply_markup: SupportPageMenu()
  });

  return;
};
