import { PalacesMenu } from '@/telegram-bot/markups';
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
  await bot.answerCallbackQuery(call.id);

  await bot.editMessageReplyMarkup(PalacesMenu(), {
    chat_id: call.from.id,
    message_id: call.message.message_id
  });

  return;
};
