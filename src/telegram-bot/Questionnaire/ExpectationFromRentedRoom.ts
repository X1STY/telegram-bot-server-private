import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const ExpectationFromRentedRoomQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ eventDateTime: string; eventSubject: string; eventVisitors: string }> => {
  await sendToUser({
    bot,
    call,
    message: 'В какую дату и время вы хотели бы арендовать помещение?'
  });
  const eventDateTime = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Какая цель и тема у проводимого мероприятия?',
    canPreviousMessageBeDeleted: false
  });
  const eventSubject = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Какое количество посетителей вы ожидаете?',
    canPreviousMessageBeDeleted: false
  });
  const eventVisitors = await ReplayQuestionCallback(bot, call);
  return {
    eventDateTime: eventDateTime.text,
    eventSubject: eventSubject.text,
    eventVisitors: eventVisitors.text
  };
};
