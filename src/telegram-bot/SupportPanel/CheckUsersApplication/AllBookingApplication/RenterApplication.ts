import { StatusConvertor } from '@/constants';
import { findUserById } from '@/telegram-bot/bot.service';
import { ApplicationCorusel, ApplicationsTypeMenu, SupportPageMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Prisma, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

const prevState: { [id: number]: application } = {};
const CALLBACKDATA = `all_eventrenter`;
type application = Prisma.AreaExpectationsApplicationGetPayload<{
  include: {
    user: {
      include: {
        contact_data: true;
      };
    };
  };
}>;

export const AllEventApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith(`${CALLBACKDATA}`) && !call.data.startsWith('applications_eventrent')) {
    return;
  }
  const user = await findUserById(call.from.id, prisma);

  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const Halls = await prisma.areaExpectationsApplication.findMany({
    where: {
      OR: [
        {
          status: 'Waiting'
        },
        {
          status: 'Pending',
          event_support_id: call.from.id
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
      event_dispatch_date: 'asc'
    }
  });
  if (Halls.length === 0) {
    await sendToUser({
      bot,
      call,
      message: 'Нет доступных заявок, находящихся в ожидании',
      keyboard: SupportPageMenu()
    });
    return;
  }
  await EventApplicationsCorusel(bot, call, Halls, prisma);
};

const EventApplicationsCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  application: application[],
  prisma: PrismaClient,
  page: number = 0
) => {
  if (prevState[call.from.id] == undefined) prevState[call.from.id] = application[0];
  if (call.data !== 'applications_eventrent') {
    if (call.data.startsWith(`${CALLBACKDATA}_to`)) {
      page = Number(call.data.split('-')[1]);
      if (page >= application.length) {
        page = 0;
      }
      prevState[call.from.id] = application[page];
    }
    console.log(page);
    if (call.data.startsWith(`${CALLBACKDATA}_selected`)) {
      const selected = call.data.split('-')[1];
      if (
        (application[selected] &&
          !!prevState &&
          application[selected].event_application_id !==
            prevState[call.from.id].event_application_id) ||
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
      await prisma.areaExpectationsApplication.update({
        data: {
          status: 'Pending',
          event_support_id: call.from.id
        },
        where: {
          event_application_id: prevState[call.from.id].event_application_id
        }
      });
      const message = await EventToLongString(application[selected], prisma);
      await bot.editMessageText(message, {
        chat_id: call.message.chat.id,
        message_id: call.message.message_id
      });
      await bot.editMessageReplyMarkup(
        ApplicationCorusel(page, page, CALLBACKDATA, true, Number(selected)),
        {
          chat_id: call.message.chat.id,
          message_id: call.message.message_id
        }
      );
      return;
    }

    if (call.data.startsWith(`${CALLBACKDATA}_accepted`)) {
      const selected = call.data.split('-')[1];
      console.log(selected, prevState[call.from.id].event_application_id);

      await prisma.areaExpectationsApplication.update({
        data: {
          status: 'Accepted',
          event_support_id: call.from.id,
          event_approval_date: new Date()
        },
        where: {
          event_application_id: prevState[call.from.id].event_application_id
        }
      });
      await sendToUser({
        bot,
        call,
        message: 'Обработано',
        keyboard: SupportPageMenu()
      });
      prevState[call.from.id] = null;
      return;
    }

    if (call.data.startsWith(`${CALLBACKDATA}_declined`)) {
      const selected = call.data.split('-')[1];
      await prisma.areaExpectationsApplication.update({
        data: {
          status: 'Declined',
          event_support_id: call.from.id,
          event_approval_date: new Date()
        },
        where: {
          event_application_id: prevState[call.from.id].event_application_id
        }
      });
      await sendToUser({
        bot,
        call,
        message: 'Обработано',
        keyboard: SupportPageMenu()
      });
      prevState[call.from.id] = null;
      return;
    }
  }

  const page_count = application.length - 1;
  const message = await EventToShortString(application[page], prisma);
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ApplicationCorusel(page, page_count, CALLBACKDATA)
  });
};

const EventToShortString = async (
  application: application,
  prisma: PrismaClient
): Promise<string> => {
  let resultString = '';
  resultString += `Дата и время аренды зала: ${application.event_date_time}\n`;
  resultString += `Количество поситителей: ${application.event_visitors}\n`;
  resultString += `Тема мероприятия: ${application.event_subject}\n`;
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
const EventToLongString = async (
  application: application,
  prisma: PrismaClient
): Promise<string> => {
  let resultString = '';
  resultString += `Дата и время аренды зала: ${application.event_date_time}\n`;
  resultString += `Количество поситителей: ${application.event_visitors}\n`;
  resultString += `Тема мероприятия: ${application.event_subject}\n`;
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
