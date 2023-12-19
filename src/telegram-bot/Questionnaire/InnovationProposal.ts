import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const InnovationProposalQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<{
  innovationMain: string;
  innovationIdea: string;
  innovationExample: string;
  innovationRes: string;
  innovationInvolve: string;
}> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['InnovationMainMessage'].message
  });
  const innovationMain = await ReplayQuestionCallback(bot, call);
  arr.push(question, innovationMain);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['InnovationIdeaMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const innovationIdea = await ReplayQuestionCallback(bot, call);
  arr.push(question, innovationIdea);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['InnovationExampleMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const innovationExample = await ReplayQuestionCallback(bot, call);
  arr.push(question, innovationExample);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['InnovationResMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const innovationRes = await ReplayQuestionCallback(bot, call);
  arr.push(question, innovationRes);

  question = await sendToUser({
    bot,
    call,
    message: botMessages['InnovationInvolveMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const innovationInvolve = await ReplayQuestionCallback(bot, call);
  arr.push(question, innovationInvolve);

  await deleteMessagesFromArray(bot, call, arr);

  return {
    innovationMain: innovationMain.text,
    innovationIdea: innovationIdea.text,
    innovationExample: innovationExample.text,
    innovationRes: innovationRes.text,
    innovationInvolve: innovationInvolve.text
  };
};
