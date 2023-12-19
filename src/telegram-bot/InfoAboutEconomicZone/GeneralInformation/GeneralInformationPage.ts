import { pathToImageFolder } from '@/constants';
import { GeneralInfoMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';
import { ExemptionsPage } from './Exemptions/Exemptions';
import { ServicesAndSupportPage } from './ServicesAndSupport/ServicesAndSupport';
import { WayToObtainStatusPage } from './WayToObtainStatus/WayToObtainsStatus';
import { botMessages } from '@/telegram-bot/bot.service';

export const GeneralInfoPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'general_info') {
    await ExemptionsPage(bot, call);
    await ServicesAndSupportPage(bot, call);
    await WayToObtainStatusPage(bot, call);
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '2.png',
    message: botMessages['GeneralInfoMessage'].message,
    keyboard: GeneralInfoMenu()
  });
  await bot.answerCallbackQuery(call.id);
  return;
};
