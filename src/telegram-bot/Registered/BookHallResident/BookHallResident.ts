import { BookingHallQuestionnare } from '@/telegram-bot/Questionnaire/BookingHall';
import { sendNotification } from '@/telegram-bot/Questionnaire/uitils/SendNotification';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu, BookHallResidentManualChooseMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { handleError } from '@/utils';
import { Halls, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const BookHallResident = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('book')) return;
  const Halls = await prisma.halls.findMany();
  await RentCorusel(bot, call, prisma, Halls);
};

const RentCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  halls: Halls[],
  page: number = 0
) => {
  if (call.data !== 'book_hall_manual_choose') {
    if (call.data.startsWith('book_hall_to')) {
      page = Number(call.data.split('-')[1]);
    } else if (call.data.includes('book_hall_selected')) {
      bot.answerCallbackQuery(call.id);
      const selected = call.data.split('-')[1];
      const chosenHallId = halls[selected].id;
      try {
        const { hallDate, hallPeriod, hallTime, hallWish } = await BookingHallQuestionnare(
          bot,
          call
        );
        await prisma.bookingHallApplication.create({
          data: {
            status: 'Waiting',
            hall_date: hallDate,
            hall_time: hallTime,
            hall_period: hallPeriod,
            hall_wish: hallWish,
            user_telegramId: call.from.id,
            chosen_hall_id: chosenHallId,
            hall_dispatch_date: new Date()
          }
        });
      } catch (error) {
        if (error.message === 'command') return;
        handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      }

      await sendToUser({
        bot,
        call,
        message: botMessages['ApplicationSent'].message,
        keyboard: BackToRegisteredMenu(),
        canPreviousMessageBeDeleted: false
      });
      await sendNotification(bot, prisma, { from: 'Booking' });

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
    photo: halls[page].photo_path,
    message: halls[page].description,
    keyboard: BookHallResidentManualChooseMenu(page, page_count)
  });
};
