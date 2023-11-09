import { findUserById } from '@/telegram-bot/bot.service';
import { ChangeUserDataMenu, RegisteredUserMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { PrismaClient, User } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const MyContacts = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  const user = await findUserById(call.from.id, prisma);
  if (call.data === 'change_my_name') {
    changeUserFullName(bot, call, user, prisma);
  }
  if (call.data === 'change_my_contacts') {
    changeUserEmailData(bot, call, user, prisma);
  }
  if (call.data !== 'my_contacts') {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const contacts = await prisma.contactData.findFirst({
    where: {
      user_telegramId: call.from.id
    }
  });

  const message =
    'Ваши данные\nИмя: ' +
    contacts.name +
    '\nПочта: ' +
    contacts.email +
    '\nТелефон: ' +
    contacts.phone +
    (contacts.organization ? '\nОрганизация: ' + contacts.organization : '') +
    (contacts.title ? '\nДолжность: ' + contacts.title : '');
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ChangeUserDataMenu()
  });
};

const changeUserFullName = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  user: User,
  prisma: PrismaClient
) => {
  await bot.answerCallbackQuery(call.id);
  await sendToUser({
    bot,
    call,
    message: 'Введите новое имя'
  });
  const responseMsg = await ReplayQuestionCallback(bot, call);
  await prisma.contactData.update({
    data: {
      name: responseMsg.text
    },
    where: {
      user_telegramId: responseMsg.from.id
    }
  });
  await sendToUser({
    bot,
    call,
    message: 'Успешно изменено!',
    keyboard: RegisteredUserMenu(user.role),
    canPreviousMessageBeDeleted: false
  });
};

const changeUserEmailData = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  user: User,
  prisma: PrismaClient
) => {
  await bot.answerCallbackQuery(call.id);
  await sendToUser({
    bot,
    call,
    message: 'Введите новую почту',
    canPreviousMessageBeDeleted: false
  });

  const responseMsg = await ReplayQuestionCallback(bot, call);
  await prisma.contactData.update({
    data: {
      email: responseMsg.text
    },
    where: {
      user_telegramId: responseMsg.from.id
    }
  });
  await sendToUser({
    bot,
    call,
    message: 'Успешно изменено!',
    keyboard: RegisteredUserMenu(user.role),
    canPreviousMessageBeDeleted: false
  });
};
