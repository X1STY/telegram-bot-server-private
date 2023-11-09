import { RentForEventManualChooseMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Halls, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { RentForEventDescribeFunc } from '../RentForEventDescribe/RentForEventDescribe';

export const RentForEventManualChoose = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  const Halls = await prisma.halls.findMany();

  RentCorusel(bot, call, prisma, Halls);
};

const RentCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  halls: Halls[],
  page: number = 0
) => {
  if (call.data !== 'rent_for_event_manual_choose') {
    if (call.data.startsWith('rent_for_event_to')) {
      page = Number(call.data.split('-')[1]);
    } else if (call.data.includes('rent_for_event_selected')) {
      const selected = call.data.split('-')[1];
      const chosenHallId = halls[selected].id;
      try {
        RentForEventDescribeFunc(bot, call, prisma, chosenHallId);
      } catch (error) {
        if (error.message === 'command') {
          return;
        } else {
          console.log(error.message);
        }
      }
      return;
    } else return;
  }
  const page_count = halls.length - 1;
  if (page_count <= 0) {
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
    photo: Buffer.from(halls[page].photo),
    message: halls[page].description,
    keyboard: RentForEventManualChooseMenu(page, page_count)
  });
};
