import { findUserById } from '@/telegram-bot/bot.service';
import { RegisteredUserMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const RegisterNewApplication = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'book_hall') {
    return;
  }

  const user = await findUserById(call.from.id, prisma);

  if (user && user.role !== 'RESIDENT') {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  await sendToUser({
    bot,
    call,
    message: 'Введите номер переговорки / конференц-зала, который вы хотите забронировать'
  });

  const meetingRoomNumber = await new Promise<TelegramBot.Message>((resolve) => {
    bot.once('message', resolve);
  });
  if (!Number(meetingRoomNumber.text)) {
    await sendToUser({
      bot,
      call,
      message: 'Номер переговорной или конференц-зала должен быть числом',
      keyboard: RegisteredUserMenu(user.role),
      canPreviousMessageBeDeleted: false
    });

    return;
  }
  await sendToUser({
    bot,
    call,
    message: 'Введите дату и время брони в формате dd.mm.yyyy hh:mm',
    canPreviousMessageBeDeleted: false
  });
  const bookingDateAndTime = await new Promise<TelegramBot.Message>((resolve) => {
    bot.once('message', resolve);
  });
  const date = stringToDate(bookingDateAndTime.text);
  try {
    await sendToUser({
      bot,
      call,
      message: 'Заявка на бронирование успешно создана',
      keyboard: RegisteredUserMenu(user.role),
      canPreviousMessageBeDeleted: false
    });
    return;
  } catch (error) {
    await sendToUser({
      bot,
      call,
      message: 'Некорректный ввод данных!',
      keyboard: RegisteredUserMenu(user.role),
      canPreviousMessageBeDeleted: false
    });
  }
};

const stringToDate = (str: string): Date | undefined => {
  try {
    const splittedDate = str.split(' ');
    const [day, month, year] = splittedDate[0].split('.').map(Number);
    const [hours, minutes] = splittedDate[1].split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  } catch (error) {
    return undefined;
  }
};
