import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const ProblemsInOEZQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ problemMain: string; problemPhotoId: string; problemAdress: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['ProblemMainMessage'].message
  });
  const problemMain = await ReplayQuestionCallback(bot, call);
  arr.push(question, problemMain);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['ProblemAdressMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const problemAdress = await ReplayQuestionCallback(bot, call);
  arr.push(question, problemAdress);
  await deleteMessagesFromArray(bot, call, arr);

  return {
    problemMain: problemMain.text ?? problemMain.caption,
    problemPhotoId: problemMain.photo
      ? problemMain.photo[problemMain.photo.length - 1].file_id
      : null,
    problemAdress: problemAdress.text
  };
};
