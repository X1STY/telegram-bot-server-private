import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const BookingHallQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ hallDate: string; hallTime: string; hallPeriod: string; hallWish: string }> => {
  await sendToUser({
    bot,
    call,
    message: 'В какой день недели вы хотели забронировать помещение?'
  });
  const hallDate = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'В какое время?',
    canPreviousMessageBeDeleted: false
  });
  const hallTime = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'На какой промежуток времени?',
    canPreviousMessageBeDeleted: false
  });
  const hallPeriod = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'У вас есть дополнительные пожелания?',
    canPreviousMessageBeDeleted: false
  });
  const hallWish = await ReplayQuestionCallback(bot, call);
  return {
    hallDate: hallDate.text,
    hallTime: hallTime.text,
    hallPeriod: hallPeriod.text,
    hallWish: hallWish.text
  };
};
