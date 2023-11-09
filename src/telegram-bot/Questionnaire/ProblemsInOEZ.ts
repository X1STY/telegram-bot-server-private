import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const ProblemsInOEZQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ problemMain: string; problemAdress: string }> => {
  await sendToUser({
    bot,
    call,
    message:
      'Опишите своими словами проблему или ситуацию, требующую технического обслуживания или ремонта',
    canPreviousMessageBeDeleted: false
  });
  const problemMain = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Укажите адрес: здание, этаж, помещение',
    canPreviousMessageBeDeleted: false
  });
  const problemAdress = await ReplayQuestionCallback(bot, call);
  return {
    problemMain: problemMain.text,
    problemAdress: problemAdress.text
  };
};
