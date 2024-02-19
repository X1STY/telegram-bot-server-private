import { ManageHallsMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AddNewHall } from './AddNewHall/AddNewHall';
import { ChangeHallData, HandleChnageDataToChosenHall } from './ChangeHallData/ChangeHallData';
import { logger } from '@/telegram-bot/bot.service';

export const ManageHalls = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'change_hall_data') {
    try {
      await AddNewHall(bot, call, prisma);
      await ChangeHallData(bot, call, prisma);
      await HandleChnageDataToChosenHall(bot, call, prisma);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
    }

    return;
  }
  await sendToUser({
    bot,
    call,
    message:
      'Меню управления помещениями для аренды под мероприятия (переговорки, конференц-залы и т.д)',
    keyboard: ManageHallsMenu()
  });
};
