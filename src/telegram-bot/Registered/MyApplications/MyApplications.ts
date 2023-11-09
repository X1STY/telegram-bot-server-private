import { pathToImageFolder } from '@/constants';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Prisma, PrismaClient } from '@prisma/client';
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
  if (!call.data.startsWith('my_applications')) {
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
  const message = userObjectToShortInfo(user);

  await sendToUser({
    bot,
    call,
    message,
    keyboard: BackToRegisteredMenu(),
    photo: pathToImageFolder + '19.png'
  });
};

const userObjectToShortInfo = (data: application): string => {
  let resultString = '';

  if (data.area_expectations_application && data.area_expectations_application.length > 0) {
    resultString += 'Заявки на аренду под мероприятие \n';
    data.area_expectations_application.forEach((application) => {
      resultString += `ID заявки: ${application.event_application_id}\n`;
      resultString += `Дата и время мероприятия: ${application.event_date_time}\n`;
      resultString += `Тема мероприятия: ${application.event_subject}\n`;
      resultString += `Выбранный конференц зал: ${application.chosen_hall_id}\n`;
      resultString += `Статус: ${application.status}\n\n`;
    });
  }

  // Booking Hall Application
  if (data.booking_hall_application && data.booking_hall_application.length > 0) {
    resultString += 'Заявки на бронирование зала:\n';
    data.booking_hall_application.forEach((application) => {
      resultString += `ID заявки: ${application.hall_application_id}\n`;
      resultString += `Дата и время зала: ${application.hall_date} + ${application.hall_time}\n`;
      resultString += `Продолжительность: ${application.hall_period}\n`;
      resultString += `Выбранный зал: ${application.chosen_hall_id}\n`;
      resultString += `Статус: ${application.status}\n\n`;
    });
  }

  // Building Plans Application
  if (data.building_plans_application && data.building_plans_application.length > 0) {
    resultString += 'Заявки на планирование строительства:\n';
    data.building_plans_application.forEach((application) => {
      resultString += `ID заявки: ${application.building_plan_id}\n`;
      resultString += `Площадь земельного участка: ${application.building_premises}\n`;
      resultString += `Дата начала строительства: ${application.building_start}\n`;
      resultString += `Статус: ${application.status}\n\n`;
    });
  }

  // Innovation Proposal Application
  if (data.innovation_proposal_application && data.innovation_proposal_application.length > 0) {
    resultString += 'Заявки на рацонализаторские предложения:\n';
    data.innovation_proposal_application.forEach((application) => {
      resultString += `ID заявки: ${application.innovation_application_id}\n`;
      resultString += `Решение направлено на проблему: ${application.innovation_main}\n`;
      resultString += `Идея инновации: ${application.innovation_idea}\n`;
      resultString += `Статус: ${application.status}\n\n`;
    });
  }

  // Key Project Parameters Application
  if (data.key_project_parameters_application) {
    resultString += 'Заявки на ключевые параметры проекта:\n';
    resultString += `ID заявки: ${data.key_project_parameters_application.project_appliocation_id}\n`;
    resultString += `Этап проекта: ${data.key_project_parameters_application.project_stage}\n`;
    resultString += `Команда проекта: ${data.key_project_parameters_application.project_crew}\n`;
    resultString += `Объем проекта: ${data.key_project_parameters_application.project_volume}\n`;
    resultString += `Статус: ${data.key_project_parameters_application.status}\n\n`;
  }

  // Problem Application
  if (data.problem_application && data.problem_application.length > 0) {
    resultString += 'Заявки на проблемы:\n';
    data.problem_application.forEach((application) => {
      resultString += `ID заявки: ${application.problem_application_id}\n`;
      resultString += `Тип проблемы: ${application.problem_reason}\n`;
      resultString += `Основная проблема: ${application.problem_main}\n`;
      resultString += `Адрес помещения: ${application.problem_adress}\n`;
      resultString += `Статус: ${application.status}\n\n`;
    });
  }

  // Rented Area Requests Application
  if (data.rented_area_requests_application && data.rented_area_requests_application.length > 0) {
    resultString += 'Заявки на аренду площади:\n';
    data.rented_area_requests_application.forEach((application) => {
      resultString += `ID заявки: ${application.area_application_id}\n`;
      resultString += `Тип площади: ${application.area_type}\n`;
      resultString += `Помещения площади: ${application.area_premises}\n`;
      resultString += `Начало аренды: ${application.area_rental_start}\n`;
      resultString += `Выбранный корпус: ${application.chosen_palace}\n`;
      resultString += `Статус: ${application.status}\n\n`;
    });
  }
  return resultString !== '' ? resultString : 'У вас еще нет ни одной заявки!';
};
