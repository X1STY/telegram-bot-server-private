import { findUserById, logger } from '@/telegram-bot/bot.service';
import { ManageSupportMenu } from '@/telegram-bot/markups';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AddSupport } from './AddSupport/AddSupport';

export const ManageSupport = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'manage_support_agent') {
    try {
      await AddSupport(bot, call, prisma);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      return;
    }
    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'ADMIN') {
    return;
  }
  await bot.editMessageReplyMarkup(ManageSupportMenu(), {
    chat_id: call.from.id,
    message_id: call.message.message_id
  });
  await bot.answerCallbackQuery(call.id);
};
