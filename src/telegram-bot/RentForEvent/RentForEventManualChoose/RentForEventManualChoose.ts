import { RentForEventManualChooseMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Halls, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { RentForEventDescribeFunc } from '../RentForEventDescribe/RentForEventDescribe';
import { logger } from '@/telegram-bot/bot.service';
import { HandleChnageData } from '@/telegram-bot/AdminPanel/ManageHalls/ChangeHallData/ChangeHallData';

export const RentForEventManualChoose = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  const Halls = await prisma.halls.findMany();
  try {
    await RentCorusel(bot, call, prisma, Halls, 0, 'rent_for_event');
  } catch (error) {
    logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);

    return;
  }
};

export const RentCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  halls: Halls[],
  page: number = 0,
  from: string
) => {
  if (call.data !== `${from}_manual_choose`) {
    if (call.data.startsWith(`${from}_to`)) {
      page = Number(call.data.split('-')[1]);
    } else if (call.data.includes(`${from}_selected`)) {
      const selected = call.data.split('-')[1];
      const chosenHallId = halls[selected].id;
      try {
        if (from === 'rent_for_event')
          await RentForEventDescribeFunc(bot, call, prisma, chosenHallId);
        if (from === 'change_hall_data') await HandleChnageData(bot, call, prisma, chosenHallId);
      } catch (error) {
        if (error.message === 'command') {
          return;
        } else {
          logger.error(
            call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error
          );
        }
      }
      return;
    } else return;
  }
  const page_count = halls.length - 1;
  if (page_count < 0) {
    await sendToUser({
      bot,
      call,
      message: 'В базе данных нет помещений. Сообщите об ошибке в поддержку'
    });
    bot.answerCallbackQuery(call.id);
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: halls[page].photo_path,
    message: halls[page].description,
    keyboard: RentForEventManualChooseMenu(page, page_count, from)
  });
};
