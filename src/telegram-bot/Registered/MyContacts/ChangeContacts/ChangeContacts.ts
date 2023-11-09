import { IContacts } from '@/telegram-bot/AlreadyRegistered/IAmAlreadyRole/IAmAlreadyRole';
import { ContactDataQuestionnare } from '@/telegram-bot/Questionnaire/ContactData';
import { ContactDataWithTitleQuestionnare } from '@/telegram-bot/Questionnaire/ContactDataWithTitle';
import { findUserById } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const ChangeContacts = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'change_my_contacts') {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const user = await findUserById(call.from.id, prisma);
  let contactData: IContacts;
  if (user.role === 'EVENTRENTER' || user.role === 'GUEST') {
    try {
      contactData = await ContactDataQuestionnare(bot, call, true);
    } catch (error) {
      if (error.message === 'command') return;
      else console.log(error.message);
    }
  } else {
    try {
      contactData = await ContactDataWithTitleQuestionnare(bot, call, true);
    } catch (error) {
      if (error.message === 'command') return;
      else console.log(error.message);
    }
  }
  const { email, name, phone, organization, title } = contactData;

  await prisma.contactData.update({
    data: {
      email,
      name,
      phone,
      organization,
      title
    },
    where: {
      user_telegramId: call.from.id
    }
  });

  await sendToUser({
    bot,
    call,
    message: 'Успешно измененно!',
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
};
