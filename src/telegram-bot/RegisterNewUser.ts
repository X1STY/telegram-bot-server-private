import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const registerNewUser = async (
  call: TelegramBot.CallbackQuery | TelegramBot.Message,
  prisma: PrismaClient
) => {
  const user = await prisma.user.findFirst({ where: { telegramId: call.from.id } });
  if (user == null) {
    try {
      await prisma.user.create({
        data: {
          telegramId: call.from.id,
          username: call.from.username,
          full_name: (call.from.first_name ?? '') + ' ' + (call.from.last_name ?? '')
        }
      });
    } catch (error) {
      console.log(error);
    }
  } else return;
};
