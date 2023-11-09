import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const BuildingPlansQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ buildingPremises: string; buildingStart: string }> => {
  await sendToUser({
    bot,
    call,
    message:
      'Какая площадь земельного участка необходима для строительства объектов в рамках вашего проекта? Укажите в гектарах или квадратных метрах.',
    canPreviousMessageBeDeleted: false
  });
  const buildingPremises = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'На какой период планируется начало строительства? Укажите плановые месяц и год.',
    canPreviousMessageBeDeleted: false
  });
  const buildingStart = await ReplayQuestionCallback(bot, call);

  return {
    buildingPremises: buildingPremises.text,
    buildingStart: buildingStart.text
  };
};
