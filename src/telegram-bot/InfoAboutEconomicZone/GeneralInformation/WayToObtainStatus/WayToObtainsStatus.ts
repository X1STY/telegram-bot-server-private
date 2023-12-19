import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToGeneralMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const WayToObtainStatusPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'way_to_obtain_status') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '5.png',
    message: botMessages['WayToObtainStatusMessage'].message,
    keyboard: BackToGeneralMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
