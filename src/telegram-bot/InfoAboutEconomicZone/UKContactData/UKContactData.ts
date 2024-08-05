import { pathToImageFolder } from '@/constants';
import { UKContactDataMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';
import { CITCenter, ICCenter, NVCCenter } from './ContactCenters/ContactCenters';
import { botMessages } from '@/telegram-bot/bot.service';

export const UKContactData = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (!call.data.startsWith('uk_contact_data')) {
    ICCenter(bot, call);
    CITCenter(bot, call);
    NVCCenter(bot, call);
    return;
  }
  await bot.answerCallbackQuery(call.id);
  const from = call.data.split('-')[1];
  if (from === 'registered') {
    await sendToUser({
      bot,
      call,
      photo: pathToImageFolder + '7.png',
      message: botMessages['UKContactDataMessageRegistered'].message,
      parseMode: 'Markdown',
      keyboard: UKContactDataMenu(from)
    });
  } else {
    await sendToUser({
      bot,
      call,
      photo: pathToImageFolder + '7.png',
      message: botMessages['UKContactDataMessage'].message,
      parseMode: 'Markdown',
      keyboard: UKContactDataMenu(from)
    });
  }
};
