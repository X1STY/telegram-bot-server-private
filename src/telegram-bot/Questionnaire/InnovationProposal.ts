import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

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
  await sendToUser({
    bot,
    call,
    message: 'Для начала опишите проблему, на решение которой направлено предложение.'
  });
  const innovationMain = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message:
      'Опишите своими словами суть рационализаторского предложения или идеи - как это должно работать.',
    canPreviousMessageBeDeleted: false
  });
  const innovationIdea = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message:
      'Укажите, если есть, общедоступные примеры внедрения подобных решений - идеальный или близкий к этому вариант.',
    canPreviousMessageBeDeleted: false
  });
  const innovationExample = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message:
      'Какие на ваш взгляд ресурсы будут необходимы для внедрения вашего предложения? (возможные варианты: предложение может быть реализовано исключительно силами УК ОЭЗ, либо с участием какого-либо органамуниципальной, региональной или федеральной власти, либо с участием представителей какого-либо бизнеса и т.п.)',
    canPreviousMessageBeDeleted: false
  });
  const innovationRes = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message:
      'В процессе внедрения вашего предложения возможно ли ваше участие (как компании и/или персональное), и, если да, в какой форме?',
    canPreviousMessageBeDeleted: false
  });
  const innovationInvolve = await ReplayQuestionCallback(bot, call);
  return {
    innovationMain: innovationMain.text,
    innovationIdea: innovationIdea.text,
    innovationExample: innovationExample.text,
    innovationRes: innovationRes.text,
    innovationInvolve: innovationInvolve.text
  };
};
