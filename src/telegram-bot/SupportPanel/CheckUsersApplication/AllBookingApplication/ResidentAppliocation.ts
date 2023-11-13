import { PalaceConvertor, StatusConvertor } from '@/constants';
import { findUserById } from '@/telegram-bot/bot.service';
import { ApplicationCorusel, ApplicationsTypeMenu, SupportPageMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Prisma, PrismaClient, Status } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

const prevState: { [id: number]: application } = {};
const CALLBACKDATA = `all_residenter`;
type application = Prisma.UserGetPayload<{
  include: {
    contact_data: true;
    key_project_parameters_application: true;
    building_plans_application: true;
    rented_area_requests_application: true;
  };
}>;

export const AllResidentApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (
    !call.data.startsWith(`${CALLBACKDATA}`) &&
    !call.data.startsWith('applications_become_resident')
  ) {
    return;
  }
  const user = await findUserById(call.from.id, prisma);

  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const Halls = await prisma.user.findMany({
    include: {
      contact_data: true,
      key_project_parameters_application: true,
      building_plans_application: true,
      rented_area_requests_application: true
    },
    where: {
      role: 'RESIDENT',
      key_project_parameters_application: {
        AND: [
          {
            user_telegramId: {
              not: {
                equals: undefined
              }
            }
          }
        ],
        OR: [
          {
            status: 'Waiting'
          },
          {
            status: 'Pending',
            project_support_id: call.from.id
          }
        ]
      }
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
  await ResidentApplicationsCorusel(bot, call, Halls, prisma);
};

const ResidentApplicationsCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  application: application[],
  prisma: PrismaClient,
  page: number = 0
) => {
  if (prevState[call.from.id] == undefined) prevState[call.from.id] = application[0];
  if (call.data !== 'applications_become_resident') {
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
          application[selected].telegramId !== prevState[call.from.id].telegramId) ||
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

      await updateDatabase(call, 'Pending', prisma);

      const message = await ResidentToLongString(prevState[call.from.id]);
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
      console.log(selected, prevState[call.from.id].telegramId);

      await updateDatabase(call, 'Accepted', prisma);

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
      console.log(selected);

      await updateDatabase(call, 'Declined', prisma);

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
  const message = await ResidentToShortString(application[page]);
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ApplicationCorusel(page, page_count, CALLBACKDATA)
  });
};

const ResidentToShortString = async (application: application): Promise<string> => {
  let resultString = 'Заявка на становление резидентом ОЭЗ\n';
  resultString += `Текущая стадия проекта: ${application.key_project_parameters_application.project_stage}\n`;
  resultString += `Количество человек работающих над проектом: ${application.key_project_parameters_application.project_crew}\n\n`;

  if (application.building_plans_application) {
    resultString += `Необходимая площадь для строительства: ${application.building_plans_application.building_premises}\n`;
    resultString += `Планируемая дата начала стройки: ${application.building_plans_application.building_start}\n\n`;
  }

  if (application.rented_area_requests_application) {
    resultString += `Необходимый тип площади: ${application.rented_area_requests_application.area_type}\n`;
    resultString += `Необходимая площадь (кв.км): ${application.rented_area_requests_application.area_premises}\n`;
    resultString += `Предполагаемый период начала аренды: ${application.rented_area_requests_application.area_rental_start}\n`;
    resultString += `Выбранный корпус: ${
      PalaceConvertor[application.rented_area_requests_application.chosen_palace]
    }\n`;
    resultString += `Статус заявки: ${
      StatusConvertor[application.rented_area_requests_application.status]
    }\n`;
  }

  return resultString;
};

const ResidentToLongString = async (application: application): Promise<string> => {
  let resultString = '';
  resultString += `Текущая стадия проекта: ${application.key_project_parameters_application.project_stage}\n`;
  resultString += `Количество человек работающих над проектом: ${application.key_project_parameters_application.project_crew}\n`;
  resultString += `Планируемый объем инвестиций: ${application.key_project_parameters_application.project_volume}\n\n`;

  if (application.building_plans_application) {
    resultString += `Необходимая площадь для строительства: ${application.building_plans_application.building_premises}\n`;
    resultString += `Планируемая дата начала стройки: ${application.building_plans_application.building_start}\n\n`;
  }

  if (application.rented_area_requests_application) {
    resultString += `Необходимый тип площади: ${application.rented_area_requests_application.area_type}\n`;
    resultString += `Необходимая площадь (кв.км): ${application.rented_area_requests_application.area_premises}\n`;
    resultString += `Предполагаемый период начала аренды: ${application.rented_area_requests_application.area_rental_start}\n`;
    resultString += `Выбранный корпус: ${
      PalaceConvertor[application.rented_area_requests_application.chosen_palace]
    }\n`;
  }

  resultString += application.username
    ? `Имя пользователя телеграм: @${application.username}\n`
    : '';
  resultString += `Имя пользователя: ${application.contact_data.name}\n`;
  resultString += `Почта пользователя: ${application.contact_data.email}\n`;
  resultString += `Номер телефона пользователя: ${application.contact_data.phone}\n`;
  if (application.contact_data.organization) {
    resultString += `Организация пользователя: ${application.contact_data.organization}\n`;
    resultString += `Должность пользователя: ${application.contact_data.title}\n`;
  }

  return resultString;
};

const updateDatabase = async (
  call: TelegramBot.CallbackQuery,
  status: Status,
  prisma: PrismaClient
) => {
  await prisma.keyProjectParametersApplication.update({
    data: {
      status: status,
      project_support_id: call.from.id
    },
    where: {
      project_appliocation_id:
        prevState[call.from.id].key_project_parameters_application.project_appliocation_id
    }
  });
  if (prevState[call.from.id].building_plans_application) {
    await prisma.buildingPlansApplication.update({
      data: {
        status: status,
        building_support_id: call.from.id
      },
      where: {
        building_plan_id: prevState[call.from.id].building_plans_application.building_plan_id
      }
    });
  } else if (prevState[call.from.id].rented_area_requests_application) {
    await prisma.rentedAreaRequestsApplication.update({
      data: {
        status: status,
        area_support_id: call.from.id
      },
      where: {
        area_application_id:
          prevState[call.from.id].rented_area_requests_application.area_application_id
      }
    });
  }
};
