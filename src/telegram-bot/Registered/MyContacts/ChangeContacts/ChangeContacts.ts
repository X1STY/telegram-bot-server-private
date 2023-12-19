import { deleteMessagesFromArray } from '@/telegram-bot/Questionnaire/uitils/DeleteMessages';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { botMessages, findUserById, logger } from '@/telegram-bot/bot.service';
import { BackToAdminPanel, BackToRegisteredMenu, ChangeUserDataMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const ChangeContacts = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'change_my_contacts') {
    if (call.data.startsWith('change_support')) return;
    handleChangeData(bot, call, prisma);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const user = await findUserById(call.from.id, prisma);
  await sendToUser({
    bot,
    call,
    message: botMessages['ChangeUserDataMessage'].message,
    keyboard: ChangeUserDataMenu(user.role)
  });
};

export const handleChangeData = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  userId?: number
) => {
  if (!call.data.startsWith('change_my-') && !call.data.startsWith('change_support-')) {
    return;
  }
  const arr: Array<TelegramBot.Message> = [];
  bot.answerCallbackQuery(call.id);
  const thingToChange = call.data.split('-')[1];
  const question = await sendToUser({
    bot,
    call,
    message: 'Введите новые данные.'
  });
  try {
    let type: 'phone' | 'email' | null = null;
    if (thingToChange === 'phone') type = 'phone';
    if (thingToChange === 'email') type = 'email';

    const response = await ReplayQuestionCallback(bot, call, type);
    await prisma.contactData.update({
      data: {
        [thingToChange]: response.text
      },
      where: {
        user_telegramId: userId ?? call.from.id
      }
    });
    arr.push(question, response);
  } catch (error) {
    if (error.message === 'command') {
      return;
    } else {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);
    }
  }

  await sendToUser({
    bot,
    call,
    message: 'Успешно измененно!',
    keyboard: call.data.includes('support') ? BackToAdminPanel() : BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
  await deleteMessagesFromArray(bot, call, arr);
};
