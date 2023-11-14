import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';

export const ContactDataWithTitleQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  canDelete: boolean = false
): Promise<{ name: string; phone: string; email: string; organization: string; title: string }> => {
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
  await sendToUser({
    bot,
    call,
    message: 'Укажите название компании, в которой вы работаете',
    canPreviousMessageBeDeleted: false
  });
  const organization = await ReplayQuestionCallback(bot, call);
  await sendToUser({
    bot,
    call,
    message: 'Укажите вашу должность',
    canPreviousMessageBeDeleted: false
  });
  const title = await ReplayQuestionCallback(bot, call);
  return {
    name: name.text,
    phone: phone.text,
    email: email.text,
    organization: organization.text,
    title: title.text
  };
};
