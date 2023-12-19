import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { botMessages, findUserById } from '../bot.service';
import { sendToUser } from '../messages';
import { BackToRegisteredMenu, BecomeAResidentMenu } from '../markups';
import { pathToImageFolder } from '@/constants';
import { ProjectParameters } from './ProjectParameters/ProjectParameters';
import { DocumentsToObtainAResidentStatus } from '../InfoAboutEconomicZone/RegulatoryDocuments/DocumentsToBecomeAResident/DocumentsToBecomeAResident';

export const BecomeAResident = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'become_a_resident') {
    await ProjectParameters(bot, call, prisma);
    await DocumentsToObtainAResidentStatus(bot, call);
    return;
  }

  const user = await findUserById(call.from.id, prisma);
  if (user.role === 'RESIDENT') {
    await sendToUser({
      bot,
      call,
      message: botMessages['RegisteredError'].message,
      keyboard: BackToRegisteredMenu()
    });
    return;
  }

  await sendToUser({
    bot,
    call,
    message: botMessages['ResidentMessage'].message,
    photo: pathToImageFolder + '16.png',
    keyboard: BecomeAResidentMenu()
  });
};
