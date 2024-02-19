import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { findUserById, logger } from '@/telegram-bot/bot.service';
import { ChosenSupportMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { ChangeSupportContacts } from './ChangeSupportContactData/ChangeSupportContactData';
import { DeleteSupport } from './DeleteSupport/DeleteSupport';
import { CheckSupportStat } from './CheckSupportStat/CheckSupportStat';
import { deleteMessagesFromArray } from '@/telegram-bot/Questionnaire/uitils/DeleteMessages';

export const state: { [id: number]: number } = {};

export const ChooseSupport = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'choose_support') {
    try {
      await ChangeSupportContacts(bot, call, prisma);
      await DeleteSupport(bot, call, prisma, state[call.from.id]);
      await CheckSupportStat(bot, call, prisma, state[call.from.id]);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      return;
    }

    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'ADMIN') {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const supports = await prisma.user.findMany({
    include: {
      contact_data: true
    },
    where: {
      role: {
        equals: 'SUPPORT'
      }
    }
  });
  if (supports.length <= 0) {
    await sendToUser({
      bot,
      call,
      message: 'Нет пользователей зарегестрированных как агенты поддержки ОЭЗ',
      canPreviousMessageBeDeleted: false
    });
    return;
  }
  const arr: Array<TelegramBot.Message> = [];

  let allEmployees = '';
  supports.forEach((user, index) => {
    allEmployees += index + '. ';
    allEmployees += user.contact_data.name + ' ';
    allEmployees += user.contact_data.email + '\n';
  });

  const question = await sendToUser({
    bot,
    call,
    message:
      allEmployees + '\n\nВведите номер агента поддержки, информацию о котором хотите просмотреть'
  });

  try {
    const index = await ReplayQuestionCallback(bot, call, 'number', [0, supports.length - 1]);
    const newEmployeeId = await prisma.contactData.findFirst({
      where: {
        name: {
          equals: supports[Number(index.text)].contact_data.name
        },
        email: {
          equals: supports[Number(index.text)].contact_data.email
        }
      }
    });
    state[call.from.id] = Number(newEmployeeId.user_telegramId);
    arr.push(question, index);
  } catch (error) {
    if (error.message === 'command') {
      return;
    }
    logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
  }

  const id = state[call.from.id];
  const currentSupport = await prisma.contactData.findFirst({
    where: {
      user_telegramId: id
    }
  });
  const message = `Агент поддержки\nИмя: ${currentSupport.name}\nПочта: ${currentSupport.email}\nНомер телефона: ${currentSupport.phone}\n\n`;

  await sendToUser({
    bot,
    call,
    message,
    canPreviousMessageBeDeleted: false,
    keyboard: ChosenSupportMenu()
  });
  await deleteMessagesFromArray(bot, call, arr);
};
