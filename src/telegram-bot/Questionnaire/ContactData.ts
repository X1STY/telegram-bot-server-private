import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const ContactDataQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  canDelete: boolean = false
): Promise<{ name: string; phone: string; email: string }> => {
  await sendToUser({
    bot,
    call,
    message: 'Как к вам можно обращаться?',
    canPreviousMessageBeDeleted: canDelete
  });
  const name = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Укажите ваш номер телефона',
    canPreviousMessageBeDeleted: false
  });
  const phone = await ReplayQuestionCallback(bot, call, 'phone');
  await sendToUser({
    bot,
    call,
    message: 'Укажите вашу электронную почту',
    canPreviousMessageBeDeleted: false
  });
  const email = await ReplayQuestionCallback(bot, call, 'email');
  return { name: name.text, phone: phone.text, email: email.text };
};
