import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const ExpectationFromRentedRoomQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ eventDateTime: string; eventSubject: string; eventVisitors: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['RentForEventDateMessage'].message
  });
  const eventDateTime = await ReplayQuestionCallback(bot, call);
  arr.push(question, eventDateTime);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['RentForEventSubjectMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const eventSubject = await ReplayQuestionCallback(bot, call);
  arr.push(question, eventSubject);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['RentForEventVisitorsMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const eventVisitors = await ReplayQuestionCallback(bot, call);
  arr.push(question, eventVisitors);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    eventDateTime: eventDateTime.text,
    eventSubject: eventSubject.text,
    eventVisitors: eventVisitors.text
  };
};
