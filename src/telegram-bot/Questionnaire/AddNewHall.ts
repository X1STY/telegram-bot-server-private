import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';
import { SavePhoto } from './uitils/HallPhoto';

export const AddHallQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ HallPhoto: string; hallDescription: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['AddNewHallPhotoQuestion'].message
  });
  const HallPhoto = await ReplayQuestionCallback(bot, call, 'photo');
  arr.push(question, HallPhoto);

  const photoPath = await SavePhoto(bot, HallPhoto);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['AddNewHallDescriptionQuestion'].message,
    canPreviousMessageBeDeleted: false
  });
  const hallDescription = await ReplayQuestionCallback(bot, call);
  arr.push(question, hallDescription);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    HallPhoto: photoPath,
    hallDescription: hallDescription.text
  };
};
