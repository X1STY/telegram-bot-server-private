import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { pathToImageFolder } from '@/constants';
import { MainMenu, RentForNotResidentMenu } from '../markups';
import { RentForNotResidentSendRequirements } from './SendRequirements/SendRequirements';
import { findUserById } from '../bot.service';

export const RentForNotResident = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_not_resident') {
    RentForNotResidentSendRequirements(bot, call, prisma);
    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'UNREGISTERED') {
    await sendToUser({
      bot,
      call,
      message: 'Вы уже зарегестрированны! Попробуйте воспользоваться меню при помощи /registered',
      keyboard: MainMenu()
    });
    return;
  }
  await sendToUser({
    bot,
    call,
    message:
      'Бизнес-центры на Южной площадке ОЭЗ располагают всем необходимым для проведения форумов, презентаций, совещаний, выставок, квизов и других мероприятий. Дорога до центра города составляет около 15 минут, современные корпуса в экологически чистом районе окружены лесопарком и имеют вместительные парковки. Залы оборудованы кондиционерами и гардеробными комнатами, в зданиях есть пространства для кофе-брейков, переговорные комнаты, лифты, системы безопасности.',
    photo: pathToImageFolder + '15.png',
    keyboard: RentForNotResidentMenu()
  });
};
