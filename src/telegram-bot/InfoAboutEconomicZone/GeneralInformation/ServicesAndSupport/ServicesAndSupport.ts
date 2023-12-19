import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToGeneralMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ServicesAndSupportPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'services_and_support') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '3.png',
    message: botMessages['ServicesAndSupportMessage'].message,
    keyboard: BackToGeneralMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
