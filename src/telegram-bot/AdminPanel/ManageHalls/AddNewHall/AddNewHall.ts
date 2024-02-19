import { AddHallQuestionnare } from '@/telegram-bot/Questionnaire/AddNewHall';
import { BackToAdminPanel } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const AddNewHall = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'add_new_hall') {
    return;
  }
  const { HallPhoto, hallDescription } = await AddHallQuestionnare(bot, call);
  await prisma.halls.create({
    data: {
      description: hallDescription,
      photo_path: HallPhoto
    }
  });
  await sendToUser({
    bot,
    call,
    message: 'Помещение успешно добавлено',
    keyboard: BackToAdminPanel()
  });
};
