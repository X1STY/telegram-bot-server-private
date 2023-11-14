import { ChangeSupportMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { state } from '../ChooseSupport';
import { handleChangeData } from '@/telegram-bot/Registered/MyContacts/ChangeContacts/ChangeContacts';

export const ChangeSupportContacts = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'edit_support_contact') {
    if (call.data.startsWith('change_support') && state[call.from.id])
      handleChangeData(bot, call, prisma, state[call.from.id]);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  await sendToUser({
    bot,
    call,
    message: 'Какие данные необходимо поменять?',
    keyboard: ChangeSupportMenu()
  });
};
