import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const RequestedRentAreaQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ areaType: string; areaPremises: string; areaRentalStart: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['NonResidentRentTypeMessage'].message
  });
  const areaType = await ReplayQuestionCallback(bot, call);
  arr.push(question, areaType);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['NonResidentRentPremisesMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const areaPremises = await ReplayQuestionCallback(bot, call);
  arr.push(question, areaPremises);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['NonResidentRentStartMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const areaRentalStart = await ReplayQuestionCallback(bot, call);
  arr.push(question, areaRentalStart);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    areaType: areaType.text,
    areaPremises: areaPremises.text,
    areaRentalStart: areaRentalStart.text
  };
};
