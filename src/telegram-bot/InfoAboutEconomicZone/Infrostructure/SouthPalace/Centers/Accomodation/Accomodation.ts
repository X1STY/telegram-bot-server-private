import { AccomodateMenu } from '@/telegram-bot/markups';
import { Palaces, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AccomodationAsRole } from './AccomodateAsRole';

export const Accomodation = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('accomodate-')) {
    AccomodationAsRole(bot, call, prisma);
    return;
  }
  const chosenPalace = Palaces[call.data.split('-')[1]];
  await bot.editMessageReplyMarkup(AccomodateMenu(chosenPalace), {
    chat_id: call.message.chat.id,
    message_id: call.message.message_id
  });
};
