import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { findUserById } from '@/telegram-bot/bot.service';
import { BackToAdminPanel } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { handleError } from '@/utils';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const AddSupport = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'add_support') {
    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'ADMIN') {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const employees = await prisma.user.findMany({
    include: {
      contact_data: true
    },
    where: {
      role: {
        equals: 'EMPLOYEE'
      }
    }
  });

  if (employees.length <= 0) {
    await sendToUser({
      bot,
      call,
      message: 'Нет пользователей зарегестрированных как сотрудники ОЭЗ',
      canPreviousMessageBeDeleted: false
    });
    return;
  }

  let allEmployees = '';
  employees.forEach((user, index) => {
    allEmployees += index + '. ';
    allEmployees += user.contact_data.name + ' ';
    allEmployees += user.contact_data.email + '\n\n';
  });

  await sendToUser({ bot, call, message: allEmployees });
  await sendToUser({
    bot,
    call,
    message: 'Введите номер сотрудника которого нужно сделать агентом поддержки',
    canPreviousMessageBeDeleted: false
  });

  try {
    const index = (await ReplayQuestionCallback(bot, call, 'number', [0, employees.length - 1]))
      .text;
    const newEmployeeId = await prisma.contactData.findFirst({
      where: {
        name: {
          equals: employees[Number(index)].contact_data.name
        },
        email: {
          equals: employees[Number(index)].contact_data.email
        }
      }
    });

    await prisma.user.update({
      data: {
        role: 'SUPPORT'
      },
      where: {
        telegramId: newEmployeeId.user_telegramId
      }
    });
    await sendToUser({
      bot,
      call,
      message: 'Статус сотрудника изменен.',
      canPreviousMessageBeDeleted: false,
      keyboard: BackToAdminPanel()
    });
  } catch (error) {
    if (error.message === 'command') return;
    handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
  }

  return;
};
