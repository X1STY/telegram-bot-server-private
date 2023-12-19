import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ReplayQuestionCallback } from '../ReplyQuestionCallback';
import { deleteMessagesFromArray } from './uitils/DeleteMessages';
import { botMessages } from '../bot.service';

export const ContactDataQuestionnare = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  canDelete: boolean = false
): Promise<{ name: string; phone: string; email: string }> => {
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: botMessages['ContactDataNameMessage'].message,
    canPreviousMessageBeDeleted: canDelete
  });
  const name = await ReplayQuestionCallback(bot, call);
  arr.push(question, name);
  question = await sendToUser({
    bot,
    call,
    message: botMessages['ContactDataPhoneMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const phone = await ReplayQuestionCallback(bot, call, 'phone');
  arr.push(question, phone);
  question = await sendToUser({
    bot,
    call,
    message: botMessages['ContactDataEmailMessage'].message,
    canPreviousMessageBeDeleted: false
  });
  const email = await ReplayQuestionCallback(bot, call, 'email');
  arr.push(question, email);

  await deleteMessagesFromArray(bot, call, arr);

  return { name: name.text, phone: phone.text, email: email.text };
};
