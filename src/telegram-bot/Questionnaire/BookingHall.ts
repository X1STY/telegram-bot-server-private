import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const BookingHallQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ hallDate: string; hallTime: string; hallPeriod: string; hallWish: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['BookingDayMessage'].message
  });
  const hallDate = await ReplayQuestionCallback(bot, call);
  arr.push(question, hallDate);
  question = await sendToUser({
    bot,
    call,
    message: botMessages['BookingTimeMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const hallTime = await ReplayQuestionCallback(bot, call);
  arr.push(question, hallTime);
  question = await sendToUser({
    bot,
    call,
    message: botMessages['BookingPeriodMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const hallPeriod = await ReplayQuestionCallback(bot, call);
  arr.push(question, hallPeriod);
  question = await sendToUser({
    bot,
    call,
    message: botMessages['BookingWishMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const hallWish = await ReplayQuestionCallback(bot, call);
  arr.push(question, hallWish);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    hallDate: hallDate.text,
    hallTime: hallTime.text,
    hallPeriod: hallPeriod.text,
    hallWish: hallWish.text
  };
};
