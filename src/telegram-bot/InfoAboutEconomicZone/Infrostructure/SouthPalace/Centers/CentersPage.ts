import { pathToImageFolder } from '@/constants';
import { CentersPlaceMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const INVENTUMPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'inventum') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'INVENTUM.png',
    message: 'Инфа про INVENTUM!',
    keyboard: CentersPlaceMenu('CIT')
  });

  await bot.answerCallbackQuery(call.id);
};

export const TECHNUMPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'technum') {
    return;
  }

  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'TECHNUM.png',
    message: 'Инфа про TECHNNUM!',
    keyboard: CentersPlaceMenu('IC')
  });

  await bot.answerCallbackQuery(call.id);
};

export const VITUMPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'vitum') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'VITUM.png',
    message: 'Инфа про VITUM!',
    keyboard: CentersPlaceMenu('NVC')
  });

  await bot.answerCallbackQuery(call.id);
};

export const FUTURUMPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'futurum') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'EC.png',
    message: 'Инфа про FUTURUM!',
    keyboard: CentersPlaceMenu('EC')
  });

  await bot.answerCallbackQuery(call.id);
};

export const EKCPOCENTERPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'expocenter') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'EXPOCENTER.png',
    message: 'Инфа про Экспоцентр!',
    keyboard: CentersPlaceMenu('EXPOCENTER')
  });

  await bot.answerCallbackQuery(call.id);
};
