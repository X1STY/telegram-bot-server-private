import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { findUserById } from '../bot.service';
import { sendToUser } from '../messages';
import { BackToRegisteredMenu, BecomeAResidentMenu } from '../markups';
import { pathToImageFolder } from '@/constants';
import { ProjectParameters } from './ProjectParameters/ProjectParameters';

export const BecomeAResident = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'become_a_resident') {
    await ProjectParameters(bot, call, prisma);
    return;
  }

  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'UNREGISTERED') {
    await sendToUser({
      bot,
      call,
      message:
        'Вы уже зарегестрированы, и не можете снова пройти регистрацию на статус резидента!\nВоспользуйтесть /registered для доступа в меню',
      keyboard: BackToRegisteredMenu()
    });
    return;
  }

  await sendToUser({
    bot,
    call,
    message:
      'Резиденты ОЭЗ пользуются льготами и преференциями, могут применять таможенную процедуру свободной таможенной зоны.',
    photo: pathToImageFolder + '16.png',
    keyboard: BecomeAResidentMenu()
  });
};
