import { pathToImageFolder } from '@/constants';
import { sendToUser } from '@/telegram-bot/messages';
import { ContactData, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { ChangeContacts } from './ChangeContacts/ChangeContacts';
import { MyContactsMenu } from '@/telegram-bot/markups';

export const MyContacts = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('my_contacts')) {
    ChangeContacts(bot, call, prisma);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const user = await prisma.user.findFirst({
    where: {
      telegramId: call.from.id
    },
    include: {
      contact_data: true
    }
  });
  const from = call.data.split('-')[1];
  await sendToUser({
    bot,
    call,
    message: GetContacts(user.contact_data),
    photo: pathToImageFolder + '20.png',
    keyboard: MyContactsMenu(from)
  });
};

export const GetContacts = (contact: ContactData): string => {
  let contactString = '';
  contactString = `Имя: ${contact.name}\nПочта:${contact.email}\nНомер телефона: ${contact.phone}`;
  if (contact.organization && contact.title) {
    contactString += `\nОрганизация: ${contact.organization}\nДолжность: ${contact.title}`;
  }
  return contactString;
};
