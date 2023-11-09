import { pathToImageFolder } from '@/constants';
import TelegramBot from 'node-telegram-bot-api';
import { MainMenu } from './markups';

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
}: IMessage) => {
  if (photo) {
    await bot.sendPhoto(
      call.message.chat.id,
      photo,
      {
        reply_markup: keyboard,
        caption: message
      },
      {
        contentType: 'image/png'
      }
    );
  } else {
    await bot.sendMessage(call.message.chat.id, message, {
      reply_markup: keyboard
    });
  }
  if (canPreviousMessageBeDeleted) {
    try {
      await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    } catch (error) {
      console.log(
        call.message.chat.id +
          ' | ' +
          call.from.username +
          ' | ' +
          call.data +
          ' | ' +
          error.message
      );
      if (call.data.startsWith('book_') || call.data.startsWith('rent_for_event_')) {
        throw new Error('command');
      }
    }
  }
};

export const MainMenuMessage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) =>
  await sendToUser({
    bot,
    call,
    message:
      'Добро пожаловать в бота, посвященного особой экономической зоне Томска. Здесь вы найдете актуальную информацию, а также ответы на ваши вопросы и возможность стать резидентом. Начнем наше увлекательное путешествие по миру экономических преимуществ вместе! 🚀',
    keyboard: MainMenu(),
    photo: pathToImageFolder + 'Обложка.png'
  });
