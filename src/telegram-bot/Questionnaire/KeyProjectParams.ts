import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const KeyProjectParamsQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{ projectStage: string; projectCrew: string; projectValue: string }> => {
  await sendToUser({
    bot,
    call,
    message: 'Текущая стадия реализации проекта (идея, стартап, действующее предприятие,др.)'
  });
  const projectStage = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Сколько человек работает сейчас над проектом?',
    canPreviousMessageBeDeleted: false
  });
  const projectCrew = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Какой объем инвестиций планируется?',
    canPreviousMessageBeDeleted: false
  });
  const projectValue = await ReplayQuestionCallback(bot, call);
  return {
    projectStage: projectStage.text,
    projectCrew: projectCrew.text,
    projectValue: projectValue.text
  };
};
