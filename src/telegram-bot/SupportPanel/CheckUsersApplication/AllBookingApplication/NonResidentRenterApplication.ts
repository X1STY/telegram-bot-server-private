import { PalaceConvertor, StatusConvertor } from '@/constants';
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
const CALLBACKDATA = `all_nonresidentrenter`;
type application = Prisma.RentedAreaRequestsApplicationGetPayload<{
  include: {
    user: {
      include: {
        contact_data: true;
      };
    };
  };
}>;

export const AllAreaApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (
    !call.data.startsWith(`${CALLBACKDATA}`) &&
    !call.data.startsWith('applications_become_nonresidentrenter')
  ) {
    return;
  }
  const user = await findUserById(call.from.id, prisma);

  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const Halls = await prisma.rentedAreaRequestsApplication.findMany({
    where: {
      OR: [
        {
          status: 'Waiting'
        },
        {
          status: 'Pending',
          area_support_id: call.from.id
        }
      ],
      AND: [
        {
          sended_as: {
            equals: 'OTHER'
          }
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
      area_dispatch_date: 'asc'
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
  await AreaApplicationsCorusel(bot, call, Halls, prisma);
};

const AreaApplicationsCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  application: application[],
  prisma: PrismaClient,
  page: number = 0
) => {
  if (prevState[call.from.id] == undefined) prevState[call.from.id] = application[0];
  if (call.data !== 'applications_become_nonresidentrenter') {
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
          application[selected].area_application_id !==
            prevState[call.from.id].area_application_id) ||
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
      await prisma.rentedAreaRequestsApplication.update({
        data: {
          status: 'Pending',
          area_support_id: call.from.id
        },
        where: {
          area_application_id: prevState[call.from.id].area_application_id
        }
      });
      const message = await AreaToLongString(prevState[call.from.id]);
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
      await prisma.rentedAreaRequestsApplication.update({
        data: {
          status: 'Accepted',
          area_support_id: call.from.id,
          area_approval_date: new Date()
        },
        where: {
          area_application_id: prevState[call.from.id].area_application_id
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
      await prisma.rentedAreaRequestsApplication.update({
        data: {
          status: 'Declined',
          area_support_id: call.from.id,
          area_approval_date: new Date()
        },
        where: {
          area_application_id: prevState[call.from.id].area_application_id
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
  const message = await AreaToShortString(application[page]);
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ApplicationCoruselMenu(page, page_count, CALLBACKDATA)
  });
};

const AreaToShortString = async (application: application): Promise<string> => {
  let resultString = '';
  resultString += `Необходимый тип площади: ${application.area_type}\n`;
  resultString += `Необходимая площадь (кв.км): ${application.area_premises}\n`;
  resultString += `Предполагаемый период начала аренды: ${application.area_rental_start}\n`;
  resultString += `Выбранный корпус: ${PalaceConvertor[application.chosen_palace]}\n`;
  resultString += `Статус заявки: ${StatusConvertor[application.status]}\n`;
  return resultString;
};

const AreaToLongString = async (application: application): Promise<string> => {
  let resultString = 'Заявка о проблеме\n';
  resultString += `Необходимый тип площади: ${application.area_type}\n`;
  resultString += `Необходимая площадь (кв.км): ${application.area_premises}\n`;
  resultString += `Предполагаемый период начала аренды: ${application.area_rental_start}\n`;
  resultString += `Выбранный корпус: ${PalaceConvertor[application.chosen_palace]}\n`;
  resultString += `Статус заявки: ${StatusConvertor[application.status]}\n\n`;

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
