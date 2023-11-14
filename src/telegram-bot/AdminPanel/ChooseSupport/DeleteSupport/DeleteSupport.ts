import { BackToAdminPanel } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const DeleteSupport = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  id?: number
) => {
  if (call.data !== 'delete_support' || id == null) {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  await prisma.user.update({
    data: {
      role: 'EMPLOYEE'
    },
    where: {
      telegramId: id
    }
  });

  await sendToUser({
    bot,
    call,
    message: 'Агент поддержки был переведен в статус сотрудника',
    keyboard: BackToAdminPanel()
  });
};
