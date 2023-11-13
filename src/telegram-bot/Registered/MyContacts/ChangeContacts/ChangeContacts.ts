import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { findUserById } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu, ChangeUserDataMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const ChangeContacts = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'change_my_contacts') {
    handleChangeData(bot, call, prisma);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const user = await findUserById(call.from.id, prisma);
  await sendToUser({
    bot,
    call,
    message: 'Какие данные необходимо поменять?',
    keyboard: ChangeUserDataMenu(user.role)
  });
};

const handleChangeData = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('change_my-')) {
    return;
  }
  bot.answerCallbackQuery(call.id);
  const thingToChange = call.data.split('-')[1];
  await sendToUser({
    bot,
    call,
    message: 'Введите новые данные.'
  });
  try {
    const response = (await ReplayQuestionCallback(bot, call)).text;
    await prisma.contactData.update({
      data: {
        [thingToChange]: response
      },
      where: {
        user_telegramId: call.from.id
      }
    });
  } catch (error) {
    if (error.message === 'command') {
      return;
    } else {
      console.log(error.message);
    }
  }

  await sendToUser({
    bot,
    call,
    message: 'Успешно измененно!',
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
};
