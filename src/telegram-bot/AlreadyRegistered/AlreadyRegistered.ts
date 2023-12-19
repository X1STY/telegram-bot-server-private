import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { BackToRegisteredMenu, IAmAlreadyRoleMenu } from '../markups';
import { IAmAlreadyRole } from './IAmAlreadyRole/IAmAlreadyRole';
import { botMessages, findUserById } from '../bot.service';

export const AlreadyRegistered = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'i_am_already') {
    await IAmAlreadyRole(bot, call, prisma);
    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'UNREGISTERED') {
    await sendToUser({
      bot,
      call,
      message: botMessages['RegisteredError'].message,
      keyboard: BackToRegisteredMenu()
    });
    return;
  }
  await sendToUser({ bot, call, message: 'Выберете свою роль.', keyboard: IAmAlreadyRoleMenu() });
};
