import { PrismaClient, Role, User } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { BackToAdminPanel, SendInfoFiltersMenu } from '@/telegram-bot/markups';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { findUserById, logger } from '@/telegram-bot/bot.service';
import { sendToUser } from '@/telegram-bot/messages';
import { RoleConvertor } from '@/constants';

const filters: { [id: number]: Array<Role> } = {};

export const SendMessageToAllUsers = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('send_information')) {
    return;
  }
  await bot.answerCallbackQuery(call.id);
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'ADMIN') return;
  if (filters[call.from.id] == null) filters[call.from.id] = [];
  if (call.data.startsWith('send_information_add_filter-')) {
    const role = Role[call.data.split('-')[1]];
    filters[call.from.id].push(role);
  }
  if (call.data === 'send_information_add_filter_clear') {
    filters[call.from.id] = [];
  }
  if (call.data === 'send_information_all_users') {
    await bot.answerCallbackQuery(call.id);
    const users = await prisma.user.findMany({
      where: {
        role: {
          notIn: ['ADMIN', 'SUPPORT']
        }
      }
    });
    await sendInformation(bot, call, users, false);
    return;
  }
  if (call.data === 'send_information_message') {
    await bot.answerCallbackQuery(call.id);
    if (filters[call.from.id].length <= 0) {
      await sendToUser({
        bot,
        call,
        message: 'Выберете фильтры для рассылки',
        canPreviousMessageBeDeleted: false
      });
      return;
    }
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: filters[call.from.id]
        }
      }
    });
    await sendInformation(bot, call, users, true);
    return;
  }
  await sendToUser({
    bot,
    call,
    message:
      'Выберете фильтры для отправки сообщения согласно ролям\n' +
      (filters[call.from.id]?.length > 0
        ? `Выбранно: ${filters[call.from.id].map((role) => RoleConvertor[role])}, `
        : 'Роли не выбраны'),
    keyboard: SendInfoFiltersMenu(filters[call.from.id])
  });

  //
};

const sendInformation = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  users: User[],
  filter: boolean = true
) => {
  await sendToUser({
    bot,
    call,
    message: 'Введите сообщение для рассылки'
  });
  let responseMsg;
  try {
    responseMsg = await ReplayQuestionCallback(bot, call);
  } catch (error) {
    if (error.message === 'command') return;
    logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
  }

  for (let i = 0; i < users.length; i++) {
    try {
      await bot.sendMessage(Number(users[i].telegramId), responseMsg.text);
    } catch (error) {
      continue;
    }
  }
  await sendToUser({
    bot,
    call,
    message: filter
      ? `Ваше сообщение отправлено ролям: ${filters[call.from.id].map(
          (role) => RoleConvertor[role]
        )}`
      : 'Ваше сообщение отправлено всем ролям (кроме администрации и агентов поддержки)',
    keyboard: BackToAdminPanel(),
    canPreviousMessageBeDeleted: false
  });

  filters[call.from.id] = [];
};
