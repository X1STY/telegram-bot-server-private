import { deleteMessagesFromArray } from '@/telegram-bot/Questionnaire/uitils/DeleteMessages';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { botMessages, logger, updateMessage } from '@/telegram-bot/bot.service';
import { BackToAdminPanel } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ChangeMessage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'change_message') {
    return;
  }
  const arr: Array<TelegramBot.Message> = [];
  let question;
  question = await sendToUser({
    bot,
    call,
    message: 'Введите номер сообщения который хотите поменять',
    canPreviousMessageBeDeleted: false
  });
  let response: TelegramBot.Message;
  try {
    response = await ReplayQuestionCallback(bot, call, 'number', [
      1,
      Object.keys(botMessages).length
    ]);
  } catch (error) {
    if (error.message === 'command') return;
    logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);
  }
  arr.push(question, response);

  const chosenMessage = Object.values(botMessages)[Number(response.text) - 1];

  question = await sendToUser({
    bot,
    call,
    message:
      'Выбрано сообщение:\n' +
      chosenMessage.shortDesc +
      '\n\nПолный текст:\n' +
      chosenMessage.message,
    canPreviousMessageBeDeleted: false
  });
  arr.push(question);

  question = await sendToUser({
    bot,
    call,
    message: 'Введите собщение, которое должно отображаться вместо текущего'
  });
  let newMessage: TelegramBot.Message;
  try {
    newMessage = await ReplayQuestionCallback(bot, call);
  } catch (error) {
    if (error.message === 'command') return;
    logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);
  }
  arr.push(question, newMessage);

  let foundKey = null;
  for (const key in botMessages) {
    if (botMessages[key].message === chosenMessage.message) {
      foundKey = key;
      break;
    }
  }
  updateMessage(foundKey, newMessage.text);
  botMessages[foundKey].message = newMessage.text;
  await deleteMessagesFromArray(bot, call, arr);
  await sendToUser({
    bot,
    call,
    message: `Сообщение ${chosenMessage.shortDesc} успешно изменено`,
    canPreviousMessageBeDeleted: false,
    keyboard: BackToAdminPanel()
  });
};
