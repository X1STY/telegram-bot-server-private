import { pathToImageFolder } from '@/constants';
import { sendToUser } from '../messages';
import TelegramBot from 'node-telegram-bot-api';
import { MainMenu, RentForEventMenu } from '../markups';
import { RentForEventManualChoose } from './RentForEventManualChoose/RentForEventManualChoose';
import { PrismaClient } from '@prisma/client';
import { RentForEventDescribe } from './RentForEventDescribe/RentForEventDescribe';

export const RentForEvent = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_event') {
    RentForEventManualChoose(bot, call, prisma);
    RentForEventDescribe(bot, call, prisma);
    return;
  }
  bot.answerCallbackQuery(call.id);
  const user = await prisma.user.findFirst({ where: { telegramId: call.from.id } });
  if (user.role !== 'EVENTRENTER' && user.role !== 'UNREGISTERED') {
    await sendToUser({
      bot,
      call,
      message: 'У вас неподходящая роль для досутупа к аренде для мероприятий!',
      keyboard: MainMenu()
    });
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '14.png',
    message: 'Можете либо описать нужные требования, либо выбрать из доступных помещений',
    keyboard: RentForEventMenu()
  });
};
