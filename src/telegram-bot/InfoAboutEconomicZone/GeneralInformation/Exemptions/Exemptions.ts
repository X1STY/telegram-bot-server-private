import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { ExemptionsMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ExemptionsPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'exemptions') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '4.png',
    message: botMessages['ExemptionsMessage'].message,
    keyboard: ExemptionsMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
