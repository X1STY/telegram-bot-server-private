import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { CITCenterMenu, ICCenterMenu, NVCCenterMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ICCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (!call.data.startsWith('ic')) {
    return;
  }
  const from = call.data.split('-')[1];
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'TECHNUM.png',
    message: botMessages['ICContactsMessage'].message,
    keyboard: ICCenterMenu(from)
  });
};
export const CITCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (!call.data.startsWith('cit')) {
    return;
  }
  const from = call.data.split('-')[1];

  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'INVENTUM.png',
    message: botMessages['CITContactsMessage'].message,
    keyboard: CITCenterMenu(from)
  });
};
export const NVCCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (!call.data.startsWith('nvc')) {
    return;
  }
  const from = call.data.split('-')[1];

  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'VITUM.png',
    message: botMessages['NVCContactsMessage'].message,
    keyboard: NVCCenterMenu(from)
  });
};
