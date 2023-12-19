import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToSouthMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const FutureBuildingPlans = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'plans_for_future_buildings') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'EC.png',
    message: botMessages['FutureBuildingPlans'].message,
    keyboard: BackToSouthMenu()
  });
};
