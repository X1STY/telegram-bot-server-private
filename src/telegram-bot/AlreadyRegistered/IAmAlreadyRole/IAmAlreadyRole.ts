import { ContactDataQuestionnare } from '@/telegram-bot/Questionnaire/ContactData';
import { ContactDataWithTitleQuestionnare } from '@/telegram-bot/Questionnaire/ContactDataWithTitle';
import { findUserById } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient, Role } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export interface IContacts {
  name: string;
  phone: string;
  email: string;
  organization?: string;
  title?: string;
}

export const IAmAlreadyRole = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('i_am_already-')) {
    return;
  }
  await bot.answerCallbackQuery(call.id);
  let contactData: IContacts;
  const role = Role[call.data.split('-')[1]];
  if (role === 'EVENTRENTER' || role === 'GUEST') {
    const user = await findUserById(call.from.id, prisma);
    if (user.role !== 'UNREGISTERED') {
      await sendToUser({
        bot,
        call,
        message:
          'Вы уже зарегестрированы под одной из ролей, и не можете зарегестрироваться повторно! Попробуйте воспользоваться /registered для доступа к меню для зарегестрированных',
        keyboard: BackToRegisteredMenu()
      });
      return;
    }
    try {
      contactData = await ContactDataQuestionnare(bot, call, true);
    } catch (error) {
      return;
    }
  } else {
    try {
      contactData = await ContactDataWithTitleQuestionnare(bot, call, true);
    } catch (error) {
      return;
    }
  }
  const { email, name, phone, organization, title } = contactData;

  await prisma.contactData.create({
    data: {
      email,
      name,
      phone,
      organization,
      title,
      user_telegramId: call.from.id
    }
  });
  await prisma.user.update({
    data: {
      role
    },
    where: {
      telegramId: call.from.id
    }
  });

  await sendToUser({
    bot,
    call,
    message:
      'Вы зарегестрированы! Попробуйте воспользоваться /registered для доступа к меню зарегестрированных',
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
};
