import { pathToImageFolder } from '@/constants';
import TelegramBot from 'node-telegram-bot-api';
import {
  EKCPOCENTERPage,
  FUTURUMPage,
  INVENTUMPage,
  TECHNUMPage,
  VITUMPage
} from './Centers/CentersPage';
import { SouthPalaceMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Accomodation } from './Centers/Accomodation/Accomodation';
import { PrismaClient } from '@prisma/client';

export const SouthPalaceInfo = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'south_palace') {
    await INVENTUMPage(bot, call);
    await TECHNUMPage(bot, call);
    await VITUMPage(bot, call);
    await FUTURUMPage(bot, call);
    await EKCPOCENTERPage(bot, call);
    await Accomodation(bot, call, prisma);
    return;
  }
  await sendToUser({
    bot,
    call,
    message: 'Инфа про южную площадку!',
    photo: pathToImageFolder + '13.png',
    keyboard: SouthPalaceMenu()
  });
  await bot.answerCallbackQuery(call.id);
};
