import { pathToImageFolder } from '@/constants';
import TelegramBot from 'node-telegram-bot-api';
import { MainMenu } from './markups';
import { botMessages, logger } from './bot.service';

interface IMessage {
  bot: TelegramBot;
  call: TelegramBot.CallbackQuery;
  message: string;
  keyboard?: TelegramBot.InlineKeyboardMarkup;
  photo?: string | Buffer;
  canPreviousMessageBeDeleted?: boolean;
}

export const sendToUser = async ({
  bot,
  call,
  message,
  keyboard,
  photo,
  canPreviousMessageBeDeleted = true
}: IMessage): Promise<TelegramBot.Message | null> => {
  let messageToReturn: TelegramBot.Message;
  if (photo) {
    try {
      messageToReturn = await bot.sendPhoto(
        call.message.chat.id,
        photo,
        {
          reply_markup: keyboard,
          caption: message,
          parse_mode: 'Markdown'
        },
        {
          contentType: 'image/png'
        }
      );
    } catch (error) {
      logger.error(call.data + '|' + error.message);
    }
  } else {
    try {
      messageToReturn = await bot.sendMessage(call.message.chat.id, message, {
        reply_markup: keyboard,
        parse_mode: 'Markdown'
      });
    } catch (error) {
      logger.error(call.data + '|' + error.message);
    }
  }
  if (canPreviousMessageBeDeleted) {
    try {
      await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);
      if (call.data.startsWith('book_') || call.data.startsWith('rent_for_event_')) {
        throw new Error('command');
      }
    }
  }
  return messageToReturn;
};

export const MainMenuMessage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  try {
    await sendToUser({
      bot,
      call,
      message: botMessages['mainMessage'].message,
      keyboard: MainMenu(),
      photo: pathToImageFolder + 'Обложка.png'
    });
  } catch (error) {
    logger.error(call.data + '|' + error.message);
  }
};
