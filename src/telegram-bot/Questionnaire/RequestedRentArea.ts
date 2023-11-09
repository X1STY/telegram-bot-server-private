import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const RequestedRentAreaQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ areaType: string; areaPremises: string; areaRentalStart: string }> => {
  await sendToUser({
    bot,
    call,
    message: 'Какой тип площадей необходим для проекта?'
  });
  const areaType = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Какая площадь (кв. км) помещений вам необходима?',
    canPreviousMessageBeDeleted: false
  });
  const areaPremises = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message:
      'На какой период планируете начало аренды? Если точная дата не определена укажите плановые месяц и год',
    canPreviousMessageBeDeleted: false
  });
  const areaRentalStart = await ReplayQuestionCallback(bot, call);
  return {
    areaType: areaType.text,
    areaPremises: areaPremises.text,
    areaRentalStart: areaRentalStart.text
  };
};
