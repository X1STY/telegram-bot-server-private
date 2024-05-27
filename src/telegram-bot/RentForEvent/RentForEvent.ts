import { pathToImageFolder } from '@/constants';
import { sendToUser } from '../messages';
import TelegramBot from 'node-telegram-bot-api';
import { MainMenu, RentForEventMenu } from '../markups';
import { RentForEventManualChoose } from './RentForEventManualChoose/RentForEventManualChoose';
import { PrismaClient } from '@prisma/client';
import { RentForEventDescribe } from './RentForEventDescribe/RentForEventDescribe';
import { botMessages } from '../bot.service';
import { handleError } from '@/utils';

export const RentForEvent = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_event') {
    try {
      await RentForEventManualChoose(bot, call, prisma);
      await RentForEventDescribe(bot, call, prisma);
    } catch (error) {
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      return;
    }

    return;
  }
  bot.answerCallbackQuery(call.id);
  const user = await prisma.user.findFirst({ where: { telegramId: call.from.id } });
  if (user.role === 'RESIDENT') {
    await sendToUser({
      bot,
      call,
      message: botMessages['RegisteredError'].message,
      keyboard: MainMenu()
    });
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '14.png',
    message: botMessages['PreEventRentMessage'].message,
    keyboard: RentForEventMenu()
  });
};
