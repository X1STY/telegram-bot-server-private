import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToSouthMenu, CentersPlaceMenu } from '@/telegram-bot/markups';
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
    message: botMessages['CITMessage'].message,
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
    message: botMessages['ICMessage'].message,
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
    message: botMessages['NVCMessage'].message,
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
    message: botMessages['ECMessage'].message,
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
    message: botMessages['EXPOCENTERMessage'].message,
    keyboard: BackToSouthMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
