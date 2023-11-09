import { pathToImageFolder } from '@/constants';
import TelegramBot from 'node-telegram-bot-api';
import { AdministrativeСenterPage } from './Centers/CentersPage';
import { NorthPalaceMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';

export const NorthPalaceInfo = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'north_palace') {
    await AdministrativeСenterPage(bot, call);
    return;
  }
  await sendToUser({
    bot,
    call,
    message: 'Инфа про северную площадку!',
    photo: pathToImageFolder + '12.png',
    keyboard: NorthPalaceMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
