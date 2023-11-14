import { findUserById } from '@/telegram-bot/bot.service';
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
    AddSupport(bot, call, prisma);
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
