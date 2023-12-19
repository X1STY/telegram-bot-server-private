import { PalaceConvertor, StatusConvertor, pathToImageFolder } from '@/constants';
import { UserApplication } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Halls, Prisma, PrismaClient } from '@prisma/client';
import { application } from 'express';
import TelegramBot from 'node-telegram-bot-api';

type application = Prisma.UserGetPayload<{
  include: {
    area_expectations_application: true;
    booking_hall_application: true;
    building_plans_application: true;
    innovation_proposal_application: true;
    key_project_parameters_application: true;
    problem_application: true;
    rented_area_requests_application: true;
  };
}>;

export const MyApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('my_applications') && !call.data.startsWith('user_application')) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      telegramId: call.from.id
    },
    include: {
      area_expectations_application: true,
      booking_hall_application: true,
      building_plans_application: true,
      innovation_proposal_application: true,
      key_project_parameters_application: true,
      problem_application: true,
      rented_area_requests_application: true
    }
  });
  const halls = await prisma.halls.findMany();

  const messages = userObjectToShortInfo(user, halls).split('\n\n');
  if (messages[messages.length - 1] === '\n' || messages[messages.length - 1] === '')
    messages.splice(messages.length - 1, 1);
  await UserApplicationCorusel(bot, call, messages);
};

const UserApplicationCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  messages: string[],
  page: number = 0
) => {
  if (call.data !== 'my_application') {
    if (call.data.startsWith('user_application_to')) {
      page = Number(call.data.split('-')[1]);
    }
  } else return;
  const page_count = messages.length - 1;
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '19.png',
    message: messages[page],
    keyboard: UserApplication(page, page_count)
  });
};

const userObjectToShortInfo = (data: application, halls: Halls[]): string => {
  let resultString = '';

  if (data.area_expectations_application && data.area_expectations_application.length > 0) {
    data.area_expectations_application.forEach((application) => {
      resultString += 'Заявка на аренду под мероприятие \n';
      resultString += `ID заявки: ${application.event_application_id}\n`;
      resultString += `Дата и время мероприятия: ${application.event_date_time}\n`;
      resultString += `Тема мероприятия: ${application.event_subject}\n`;
      if (application.chosen_hall_id) {
        const hall = halls.filter((x) => x.id === application.chosen_hall_id)[0];
        const description = hall.description.split('\n')[0];
        resultString += `Выбранное помещение: ${description}\n`;
      } else {
        resultString += 'Помещение не выбрано.\n';
      }

      resultString += `Статус: ${StatusConvertor[application.status]}\n\n`;
    });
  }

  // Booking Hall Application
  if (data.booking_hall_application && data.booking_hall_application.length > 0) {
    resultString += 'Заявки на бронирование зала:\n';
    data.booking_hall_application.forEach((application) => {
      resultString += `ID заявки: ${application.hall_application_id}\n`;
      resultString += `Дата и время зала: ${application.hall_date} ${application.hall_time}\n`;
      resultString += `Продолжительность: ${application.hall_period}\n`;
      if (application.chosen_hall_id) {
        const hall = halls.filter((x) => x.id === application.chosen_hall_id)[0];
        const description = hall.description.split('\n')[0];
        resultString += `Выбранное помещение: ${description}\n`;
      } else {
        resultString += 'Помещение не выбрано.\n';
      }
      resultString += `Статус: ${StatusConvertor[application.status]}\n\n`;
    });
  }

  // Building Plans Application
  if (data.building_plans_application) {
    resultString += 'Заявка на планирование строительства:\n';
    resultString += `ID заявки: ${data.building_plans_application.building_plan_id}\n`;
    resultString += `Площадь земельного участка: ${data.building_plans_application.building_premises}\n`;
    resultString += `Дата начала строительства: ${data.building_plans_application.building_start}\n`;
    resultString += `Статус: ${StatusConvertor[data.building_plans_application.status]}\n\n`;
  }

  // Innovation Proposal Application
  if (data.innovation_proposal_application && data.innovation_proposal_application.length > 0) {
    data.innovation_proposal_application.forEach((application) => {
      resultString += 'Заявка на рацонализаторские предложения:\n';
      resultString += `ID заявки: ${application.innovation_application_id}\n`;
      resultString += `Решение направлено на проблему: ${application.innovation_main}\n`;
      resultString += `Идея инновации: ${application.innovation_idea}\n`;
      resultString += `Статус: ${StatusConvertor[application.status]}\n\n`;
    });
  }

  // Key Project Parameters Application
  if (data.key_project_parameters_application) {
    resultString += 'Заявка на ключевые параметры проекта:\n';
    resultString += `ID заявки: ${data.key_project_parameters_application.project_appliocation_id}\n`;
    resultString += `Этап проекта: ${data.key_project_parameters_application.project_stage}\n`;
    resultString += `Команда проекта: ${data.key_project_parameters_application.project_crew}\n`;
    resultString += `Объем проекта: ${data.key_project_parameters_application.project_volume}\n`;
    resultString += `Статус: ${
      StatusConvertor[data.key_project_parameters_application.status]
    }\n\n`;
  }

  // Problem Application
  if (data.problem_application && data.problem_application.length > 0) {
    resultString += 'Заявка о проблеме:\n';
    data.problem_application.forEach((application) => {
      resultString += `ID заявки: ${application.problem_application_id}\n`;
      resultString += `Тип проблемы: ${application.problem_reason}\n`;
      resultString += `Основная проблема: ${application.problem_main}\n`;
      resultString += `Адрес помещения: ${application.problem_adress}\n`;
      resultString += `Статус: ${StatusConvertor[application.status]}\n\n`;
    });
  }

  // Rented Area Requests Application
  if (data.rented_area_requests_application && data.rented_area_requests_application.length > 0) {
    resultString += 'Заявка на аренду площади:\n';
    data.rented_area_requests_application.forEach((application) => {
      resultString += `ID заявки: ${application.area_application_id}\n`;
      resultString += `Тип площади: ${application.area_type}\n`;
      resultString += `Помещения площади: ${application.area_premises}\n`;
      resultString += `Начало аренды: ${application.area_rental_start}\n`;
      if (application.chosen_palace) {
        const description = PalaceConvertor[application.chosen_palace];
        resultString += `Выбранный корпус: ${description}\n`;
      } else {
        resultString += 'Корпус не выбран.\n';
      }
      resultString += `Статус: ${StatusConvertor[application.status]}\n\n`;
    });
  }
  return resultString !== '' ? resultString : 'У вас еще нет ни одной заявки!';
};
