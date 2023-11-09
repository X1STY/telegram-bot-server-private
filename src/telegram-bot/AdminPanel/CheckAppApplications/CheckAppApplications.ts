import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AdminPanelMenu } from '@/telegram-bot/markups';
import { findUserById } from '@/telegram-bot/bot.service';
import { sendToUser } from '@/telegram-bot/messages';

export const CheckAppApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'ADMIN') return;
  if (call.data !== 'check_all_applications') {
    return;
  }
  await bot.answerCallbackQuery(call.id);
  const message = ' ';
  await sendToUser({
    bot,
    call,
    message,
    keyboard: AdminPanelMenu()
  });
};
