import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToSouthMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const LandPlots = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'land_plots') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'lands.png',
    message: botMessages['LandPlotsMessage'].message,
    parseMode: 'Markdown',
    keyboard: BackToSouthMenu()
  });
};
