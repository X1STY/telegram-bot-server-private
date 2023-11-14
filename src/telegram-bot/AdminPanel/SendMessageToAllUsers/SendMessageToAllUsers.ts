import { PrismaClient, Role } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AdminPanelMenu } from '@/telegram-bot/markups';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { findUserById } from '@/telegram-bot/bot.service';
import { sendToUser } from '@/telegram-bot/messages';

const filters: { [id: number]: Array<Role> } = {};

export const SendMessageToAllUsers = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'send_msg_to_all') {
    return;
  }
  await bot.answerCallbackQuery(call.id);
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'ADMIN') return;
  await sendToUser({
    bot,
    call,
    message: 'Введите сообщение для рассылки всем пользователям',
    canPreviousMessageBeDeleted: false
  });

  const responseMsg = await ReplayQuestionCallback(bot, call);
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: filters[call.from.id]
      }
    }
  });
  for (let i = 0; i < users.length; i++) {
    try {
      await bot.sendMessage(users[i].telegramId, responseMsg.text);
    } catch (error) {
      continue;
    }
  }
  await sendToUser({
    bot,
    call,
    message: 'Рассылка началась!',
    keyboard: AdminPanelMenu(),
    canPreviousMessageBeDeleted: false
  });
};
