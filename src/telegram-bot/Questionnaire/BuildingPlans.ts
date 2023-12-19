import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const BuildingPlansQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ buildingPremises: string; buildingStart: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['BuildPremisesMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const buildingPremises = await ReplayQuestionCallback(bot, call);
  arr.push(question, buildingPremises);
  question = await sendToUser({
    bot,
    call,
    message: botMessages['BuildStartMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const buildingStart = await ReplayQuestionCallback(bot, call);
  arr.push(question, buildingStart);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    buildingPremises: buildingPremises.text,
    buildingStart: buildingStart.text
  };
};
