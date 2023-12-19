import { StatusConvertor } from '@/constants';
import { botMessages, findUserById } from '@/telegram-bot/bot.service';
import {
  ApplicationCoruselMenu,
  ApplicationsTypeMenu,
  SupportPageMenu
} from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Prisma, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

const prevState: { [id: number]: application } = {};
const CALLBACKDATA = `all_booking`;
type application = Prisma.BookingHallApplicationGetPayload<{
  include: {
    user: {
      include: {
        contact_data: true;
      };
    };
  };
}>;

export const AllBookingApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith(`${CALLBACKDATA}`) && !call.data.startsWith('applications_book')) {
    return;
  }
  const user = await findUserById(call.from.id, prisma);

  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const Halls = await prisma.bookingHallApplication.findMany({
    where: {
      OR: [
        {
          status: 'Waiting'
        },
        {
          status: 'Pending',
          hall_support_id: call.from.id
        }
      ]
    },
    include: {
      user: {
        include: {
          contact_data: true
        }
      }
    },
    orderBy: {
      hall_dispatch_date: 'asc'
    }
  });
  if (Halls.length === 0) {
    await sendToUser({
      bot,
      call,
      message: botMessages['NoApplicationMessage'].message,
      keyboard: SupportPageMenu()
    });
    return;
  }
  await BookingApplicationsCorusel(bot, call, Halls, prisma);
};

const BookingApplicationsCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  application: application[],
  prisma: PrismaClient,
  page: number = 0
) => {
  if (prevState[call.from.id] == undefined) prevState[call.from.id] = application[0];
  if (call.data !== 'applications_book') {
    if (call.data.startsWith(`${CALLBACKDATA}_to`)) {
      page = Number(call.data.split('-')[1]);
      if (page >= application.length) {
        page = 0;
      }
      prevState[call.from.id] = application[page];
    }
    if (call.data.startsWith(`${CALLBACKDATA}_selected`)) {
      const selected = call.data.split('-')[1];
      if (
        (application[selected] &&
          !!prevState &&
          application[selected].hall_application_id !==
            prevState[call.from.id].hall_application_id) ||
        Number(selected) > application.length - 1
      ) {
        await sendToUser({
          bot,
          call,
          message:
            'Произошла ошибка! Выбранная вами заявка либо в процессе обработки другим агентом поддержки, либо ее не существует!',
          keyboard: ApplicationsTypeMenu()
        });
        prevState[call.from.id] = undefined;
        return;
      }
      await prisma.bookingHallApplication.update({
        data: {
          status: 'Pending',
          hall_support_id: call.from.id
        },
        where: {
          hall_application_id: prevState[call.from.id].hall_application_id
        }
      });
      const message = await BookingToLongString(application[selected], prisma);
      await bot.editMessageText(message, {
        chat_id: call.message.chat.id,
        message_id: call.message.message_id
      });
      await bot.editMessageReplyMarkup(
        ApplicationCoruselMenu(page, page, CALLBACKDATA, true, Number(selected)),
        {
          chat_id: call.message.chat.id,
          message_id: call.message.message_id
        }
      );
      return;
    }

    if (call.data.startsWith(`${CALLBACKDATA}_accepted`)) {
      const selected = call.data.split('-')[1];
      await prisma.bookingHallApplication.update({
        data: {
          status: 'Accepted',
          hall_support_id: call.from.id,
          hall_approval_date: new Date()
        },
        where: {
          hall_application_id: prevState[call.from.id].hall_application_id
        }
      });
      await sendToUser({
        bot,
        call,
        message: botMessages['ProcessedApplicationMessage'].message,
        keyboard: SupportPageMenu()
      });
      prevState[call.from.id] = null;
      return;
    }

    if (call.data.startsWith(`${CALLBACKDATA}_declined`)) {
      const selected = call.data.split('-')[1];
      await prisma.bookingHallApplication.update({
        data: {
          status: 'Declined',
          hall_support_id: call.from.id,
          hall_approval_date: new Date()
        },
        where: {
          hall_application_id: prevState[call.from.id].hall_application_id
        }
      });
      await sendToUser({
        bot,
        call,
        message: botMessages['ProcessedApplicationMessage'].message,
        keyboard: SupportPageMenu()
      });
      prevState[call.from.id] = null;
      return;
    }
  }

  const page_count = application.length - 1;
  const message = await BookingToShortString(application[page], prisma);
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ApplicationCoruselMenu(page, page_count, CALLBACKDATA)
  });
};

const BookingToShortString = async (
  application: application,
  prisma: PrismaClient
): Promise<string> => {
  let resultString = '';
  resultString += `Дата и время зала: ${application.hall_date} + ${application.hall_time}\n`;
  resultString += `Продолжительность: ${application.hall_period}\n`;
  if (application.chosen_hall_id) {
    const hall = await prisma.halls.findFirst({ where: { id: application.chosen_hall_id } });
    const description = hall.description.split('\n')[0];
    resultString += `Выбранное помещение: ${description}\n`;
  } else {
    resultString += 'Помещение не выбрано.\n';
  }
  resultString += `Статус заявки: ${StatusConvertor[application.status]}`;
  return resultString;
};
const BookingToLongString = async (
  application: application,
  prisma: PrismaClient
): Promise<string> => {
  let resultString = 'Заявка на аренду помещения от резидента\n';
  resultString += `ID заявки: ${application.hall_application_id}\n`;
  resultString += `Дата и время зала: ${application.hall_date} + ${application.hall_time}\n`;
  resultString += `Продолжительность: ${application.hall_period}\n`;
  resultString += `Пожелания: ${application.hall_wish}\n`;
  if (application.chosen_hall_id) {
    const hall = await prisma.halls.findFirst({ where: { id: application.chosen_hall_id } });
    const description = hall.description.split('\n')[0];
    resultString += `Выбранное помещение: ${description}\n\n`;
  } else {
    resultString += 'Помещение не выбрано.\n\n';
  }
  resultString += application.user.username
    ? `Имя пользователя телеграм: @${application.user.username}\n`
    : '';
  resultString += `Имя пользователя: ${application.user.contact_data.name}\n`;
  resultString += `Почта пользователя: ${application.user.contact_data.email}\n`;
  resultString += `Номер телефона пользователя: ${application.user.contact_data.phone}\n`;
  if (application.user.contact_data.organization) {
    resultString += `Организация пользователя: ${application.user.contact_data.organization}\n`;
    resultString += `Должность пользователя: ${application.user.contact_data.title}\n`;
  }

  return resultString;
};
