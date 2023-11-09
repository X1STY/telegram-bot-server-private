import { pathToImageFolder } from '@/constants';
import { CITCenterMenu, ICCenterMenu, NVCCenterMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ICCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'ic') {
    return;
  }
  //https://yandex.ru/profile/-/CDaLnLYH
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'TECHNUM.png',
    message: 'Информация об ИЦ УК',
    keyboard: ICCenterMenu()
  });
};
export const CITCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'cit') {
    return;
  }
  //https://yandex.ru/profile/-/CDaLnLYH
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'INVENTUM.png',
    message: 'Информация об ЦИТ УК',
    keyboard: CITCenterMenu()
  });
};
export const NVCCenter = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'nvc') {
    return;
  }
  //https://yandex.ru/profile/-/CDaLnLYH
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'VITUM.png',
    message: 'Информация об НВЦ УК',
    keyboard: NVCCenterMenu()
  });
};
