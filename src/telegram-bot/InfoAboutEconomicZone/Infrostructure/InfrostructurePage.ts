import { PalacesMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';
import { NorthPalaceInfo } from './NorthPalace/NorthPalacePage';
import { SouthPalaceInfo } from './SouthPalace/SouthPalacePage';
import { PrismaClient } from '@prisma/client';

export const InfoAboutInfrostructure = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'infrostructure') {
    await SouthPalaceInfo(bot, call, prisma);
    await NorthPalaceInfo(bot, call);
    return;
  }

  await sendToUser({
    bot,
    call,
    message:
      'В нашем городе существует две площадки Особых экономических зон: Южная и Северная.\nВыберете интересующую Вас.',
    keyboard: PalacesMenu()
  });

  await bot.answerCallbackQuery(call.id);
  return;
};
