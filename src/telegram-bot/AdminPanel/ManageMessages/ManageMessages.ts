import { ManageMessagesMenu } from '@/telegram-bot/markups';
import TelegramBot from 'node-telegram-bot-api';
import { SeeAllMessages } from './SeeAllMessages/SeeAllMessages';
import { ChangeMessage } from './ChangeMessage/ChangeMessage';
import { handleError } from '@/utils';

export const ManageMessages = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'manage_messages') {
    try {
      await ChangeMessage(bot, call);
      await SeeAllMessages(bot, call);
    } catch (error) {
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      return;
    }

    return;
  }
  await bot.answerCallbackQuery(call.id);
  await bot.editMessageReplyMarkup(ManageMessagesMenu(), {
    chat_id: call.from.id,
    message_id: call.message.message_id
  });
};
