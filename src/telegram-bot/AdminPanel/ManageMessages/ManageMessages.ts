import { ManageMessagesMenu } from '@/telegram-bot/markups';
import TelegramBot from 'node-telegram-bot-api';
import { SeeAllMessages } from './SeeAllMessages/SeeAllMessages';
import { ChangeMessage } from './ChangeMessage/ChangeMessage';
import { logger } from '@/telegram-bot/bot.service';

export const ManageMessages = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'manage_messages') {
    try {
      await ChangeMessage(bot, call);
      await SeeAllMessages(bot, call);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);
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
