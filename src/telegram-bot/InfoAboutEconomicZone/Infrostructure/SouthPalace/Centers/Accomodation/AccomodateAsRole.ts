import { ProjectParametersFunc } from '@/telegram-bot/BecomeAResident/ProjectParameters/ProjectParameters';
import { RentForNotResidentSendRequirementsFunc } from '@/telegram-bot/RentForNotResident/SendRequirements/SendRequirements';
import { Palaces, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const AccomodationAsRole = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('accomodate_')) {
    return;
  }
  const chosenPalace = Palaces[call.data.split('-')[1]];

  if (call.data.includes('as_resident')) {
    ProjectParametersFunc(bot, call, prisma, chosenPalace);
  }
  if (call.data.includes('no_resident')) {
    RentForNotResidentSendRequirementsFunc(bot, call, prisma, chosenPalace);
  }
};
