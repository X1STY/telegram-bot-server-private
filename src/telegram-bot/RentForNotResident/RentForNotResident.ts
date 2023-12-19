import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { pathToImageFolder } from '@/constants';
import { RentForNotResidentMenu } from '../markups';
import { RentForNotResidentSendRequirements } from './SendRequirements/SendRequirements';
import { botMessages } from '../bot.service';

export const RentForNotResident = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_not_resident') {
    await RentForNotResidentSendRequirements(bot, call, prisma);
    return;
  }
  // const user = await findUserById(call.from.id, prisma);
  // if (user.role !== 'UNREGISTERED') {
  //   await sendToUser({
  //     bot,
  //     call,
  //     message: botMessages['RegisteredError'].message,
  //     keyboard: MainMenu()
  //   });
  //   return;
  // }
  await sendToUser({
    bot,
    call,
    message: botMessages['NonResidentRentMessage'].message,
    photo: pathToImageFolder + '15.png',
    keyboard: RentForNotResidentMenu()
  });
};
