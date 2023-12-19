import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const KeyProjectParamsQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ projectStage: string; projectCrew: string; projectValue: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['ProjectParametersStageMessage'].message
  });
  const projectStage = await ReplayQuestionCallback(bot, call);
  arr.push(question, projectStage);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['ProjectParametersCrewMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const projectCrew = await ReplayQuestionCallback(bot, call);
  arr.push(question, projectCrew);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['ProjectParametersValueMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const projectValue = await ReplayQuestionCallback(bot, call);
  arr.push(question, projectValue);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    projectStage: projectStage.text,
    projectCrew: projectCrew.text,
    projectValue: projectValue.text
  };
};
