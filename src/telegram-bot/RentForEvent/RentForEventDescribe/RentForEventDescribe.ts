import { ContactDataQuestionnare } from '@/telegram-bot/Questionnaire/ContactData';
import { ExpectationFromRentedRoomQuestionnare } from '@/telegram-bot/Questionnaire/ExpectationFromRentedRoom';
import { sendNotification } from '@/telegram-bot/Questionnaire/uitils/SendNotification';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { handleError } from '@/utils';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const RentForEventDescribe = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_event_send_requirements') {
    return;
  }
  RentForEventDescribeFunc(bot, call, prisma);
};

export const RentForEventDescribeFunc = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  selectedHall?: number
) => {
  const user = await prisma.user.findFirst({
    where: { telegramId: call.from.id },
    include: { contact_data: true }
  });

  await bot.answerCallbackQuery(call.id);
  if (user.role === 'RESIDENT') {
    await sendToUser({
      bot,
      call,
      message: botMessages['RegisteredError'].message,
      keyboard: BackToRegisteredMenu()
    });
  }

  try {
    const { eventDateTime, eventSubject, eventVisitors } =
      await ExpectationFromRentedRoomQuestionnare(bot, call);

    await prisma.areaExpectationsApplication.create({
      data: {
        event_date_time: eventDateTime,
        event_subject: eventSubject,
        event_visitors: eventVisitors,
        status: 'Waiting',
        user_telegramId: call.from.id,
        chosen_hall_id: selectedHall,
        event_dispatch_date: new Date()
      }
    });
  } catch (error) {
    if (error.message === 'command') {
      return;
    } else
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
  }

  if (!user.contact_data || !user.contact_data.email) {
    try {
      const { email, name, phone } = await ContactDataQuestionnare(bot, call);
      await prisma.contactData.create({
        data: { email, name, phone, user_telegramId: call.from.id }
      });
    } catch (error) {
      if (error.message === 'command') {
        return;
      } else
        handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
    }
  }

  if (user.role === 'UNREGISTERED') {
    await prisma.user.update({
      data: { role: 'EVENTRENTER' },
      where: { telegramId: call.from.id }
    });
    await sendToUser({
      bot,
      call,
      message: botMessages['RegisteredSuccess'].message,
      canPreviousMessageBeDeleted: false
    });
  }

  await sendToUser({
    bot,
    call,
    message: botMessages['ApplicationSent'].message,
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
  await sendNotification(bot, prisma, { from: 'EventRent' });
};
