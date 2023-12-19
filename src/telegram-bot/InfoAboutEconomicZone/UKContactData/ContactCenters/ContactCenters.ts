import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { CITCenterMenu, ICCenterMenu, NVCCenterMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ICCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'ic') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'TECHNUM.png',
    message: botMessages['ICContactsMessage'].message,
    keyboard: ICCenterMenu()
  });
};
export const CITCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'cit') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'INVENTUM.png',
    message: botMessages['CITContactsMessage'].message,
    keyboard: CITCenterMenu()
  });
};
export const NVCCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'nvc') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'VITUM.png',
    message: botMessages['NVCContactsMessage'].message,
    keyboard: NVCCenterMenu()
  });
};
