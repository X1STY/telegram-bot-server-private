import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import * as ExcelJS from 'exceljs';
import { PalaceConvertor, RoleConvertor, StatusConvertor } from '@/constants';
import { sendToUser } from '@/telegram-bot/messages';

export const GenerateStatistic = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('generate_statistic-')) {
    return;
  }
  try {
    await fromDatabaseToExcel(prisma);
    const date = new Date();
    await bot.sendDocument(
      call.from.id,
      'StatisticTable.xlsx',
      {},
      {
        filename: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}.xlsx`
      }
    );
  } catch (error) {
    await sendToUser({
      bot,
      call,
      message: 'Произошла ошибка при генерации файла.',
      canPreviousMessageBeDeleted: false
    });
    console.log(`[ERROR] ${new Date()} - generate statistic error`, error);
  }
  await bot.answerCallbackQuery(call.id);
};

const fromDatabaseToExcel = async (prisma: PrismaClient) => {
  const workbook = new ExcelJS.Workbook();
  const halls = await prisma.halls.findMany();
  const users = await prisma.user.findMany({
    include: {
      contact_data: true
    }
  });
  const userWorksheet = workbook.addWorksheet('Пользователи');
  userWorksheet.addRow([
    'telegram ID',
    'Имя пользователя telegram',
    'Полное имя telegram',
    'Роль',
    'Имя',
    'Почта',
    'Номер телефона',
    'Организация',
    'Должность'
  ]);

  users.forEach((user) => {
    userWorksheet.addRow([
      user.telegramId,
      user.username ?? 'Не заполненно',
      user.full_name ?? 'Не заполненно',
      RoleConvertor[user.role],
      user.contact_data?.name ?? 'Не заполненно',
      user.contact_data?.email ?? 'Не заполненно',
      user.contact_data?.phone ?? 'Не заполненно',
      user.contact_data?.organization ?? 'Не заполненно',
      user.contact_data?.title ?? 'Не заполненно'
    ]);
  });

  const eventWorkSheet = workbook.addWorksheet('Заявки - аренда для мероприятий');
  const events = await prisma.areaExpectationsApplication.findMany();
  eventWorkSheet.addRow([
    'Номер заявки',
    'Дата и время проведения',
    'Цель и тема',
    'Количество поситителей',
    'Выбранное помещение',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);
  events.forEach((event) => {
    eventWorkSheet.addRow([
      event.event_application_id,
      event.event_date_time,
      event.event_subject,
      event.event_visitors,
      event.chosen_hall_id
        ? halls.filter((x) => x.id === event.chosen_hall_id)[0].description.split('\n')[0]
        : 'Не выбрано',
      event.user_telegramId,
      StatusConvertor[event.status],
      event.event_dispatch_date.toLocaleString(),
      event.event_support_id ?? 'Не закреплен',
      event.event_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });

  const bookWorksheet = workbook.addWorksheet('Заявки - аренда для резидентов');
  const booking = await prisma.bookingHallApplication.findMany();
  bookWorksheet.addRow([
    'Номер заявки',
    'День недели',
    'Время',
    'Период аренды',
    'Дополнительные пожелания',
    'Выбранное помещение',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);
  booking.forEach((application) => {
    bookWorksheet.addRow([
      application.hall_application_id,
      application.hall_date,
      application.hall_time,
      application.hall_period,
      application.hall_wish,
      application.chosen_hall_id
        ? halls.filter((x) => x.id === application.chosen_hall_id)[0].description.split('\n')[0]
        : 'Не выбрано',
      application.user_telegramId,
      StatusConvertor[application.status],
      application.hall_dispatch_date.toLocaleString(),
      application.hall_support_id ?? 'Не закреплен',
      application.hall_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });
  const buildWorksheet = workbook.addWorksheet('Заявки - план постройки');
  const building = await prisma.buildingPlansApplication.findMany({});
  buildWorksheet.addRow([
    'Номер заявки',
    'Необходимая площадь земельного участка',
    'Планируемый период начала строительства',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);
  building.forEach((application) => {
    buildWorksheet.addRow([
      application.building_plan_id,
      application.building_premises,
      application.building_start,
      application.user_telegramId,
      StatusConvertor[application.status],
      application.building_dispatch_date.toLocaleString(),
      application.building_support_id ?? 'Не закреплен',
      application.building_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });

  const keyProjectWorksheet = workbook.addWorksheet('Заявки - ключевые параметры');
  const keyProjectApplication = await prisma.keyProjectParametersApplication.findMany();
  keyProjectWorksheet.addRow([
    'Номер заявки',
    'Текущая стадия проекта',
    'Количество человек, работающих над проектом',
    'Планируемый объем инвестиций',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);
  keyProjectApplication.forEach((application) => {
    keyProjectWorksheet.addRow([
      application.project_appliocation_id,
      application.project_stage,
      application.project_crew,
      application.project_volume,
      application.user_telegramId,
      StatusConvertor[application.status],
      application.project_dispatch_date.toLocaleString(),
      application.project_support_id ?? 'Не закреплен',
      application.project_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });

  const areaWorksheet = workbook.addWorksheet('Заявки - требования к аренде');
  const areaApplication = await prisma.rentedAreaRequestsApplication.findMany();
  areaWorksheet.addRow([
    'Номер заявки',
    'Тип площади',
    'Площадь (кв.км)',
    'Планируемая дата начала аренды',
    'Выбранный корпус',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);
  areaApplication.forEach((application) => {
    areaWorksheet.addRow([
      application.area_application_id,
      application.area_type,
      application.area_premises,
      application.area_rental_start,
      PalaceConvertor[application.chosen_palace],
      application.user_telegramId,
      StatusConvertor[application.status],
      application.area_dispatch_date.toLocaleString(),
      application.area_support_id ?? 'Не закреплен',
      application.area_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });

  const problemWorksheet = workbook.addWorksheet('Заявки - Проблемы в ОЭЗ');
  const problemApplication = await prisma.problemApplication.findMany();
  problemWorksheet.addRow([
    'Номер заявки',
    'Описание проблемы',
    'Адрес',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);
  problemApplication.forEach((application) => {
    problemWorksheet.addRow([
      application.problem_application_id,
      application.problem_main,
      application.problem_adress,
      application.user_telegramId,
      StatusConvertor[application.status],
      application.problem_dispatch_date.toLocaleString(),
      application.problem_support_id ?? 'Не закреплен',
      application.problem_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });

  const innovationWorksheet = workbook.addWorksheet('Заявки - РацПредложения');
  const innovationApplication = await prisma.innovationProposalApplication.findMany();
  innovationWorksheet.addRow([
    'Номер заявки',
    'Описание проблемы для решения',
    'Суть предложения или идеи',
    'Примеры внедрения решения',
    'Необходимые ресурсы для внедрения',
    'Участие отправителя',
    'telegram ID отправителя',
    'Статус',
    'Дата отправки заявки',
    'telegramID агента поддержки',
    'Дата обработки заявки'
  ]);

  innovationApplication.forEach((application) => {
    innovationWorksheet.addRow([
      application.innovation_application_id,
      application.innovation_main,
      application.innovation_idea,
      application.innovation_example,
      application.innovation_res,
      application.innovation_involve,
      application.user_telegramId,
      StatusConvertor[application.status],
      application.innovation_dispatch_date.toLocaleString(),
      application.innovation_support_id ?? 'Не закреплен',
      application.innovation_approval_date?.toLocaleString() ?? 'Не обработана'
    ]);
  });

  // formating
  const sheetArray: ExcelJS.Worksheet[] = [
    userWorksheet,
    eventWorkSheet,
    bookWorksheet,
    buildWorksheet,
    keyProjectWorksheet,
    areaWorksheet,
    problemWorksheet,
    innovationWorksheet
  ];

  sheetArray.forEach((worksheet) => {
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 3;
    });
  });

  await workbook.xlsx.writeFile('StatisticTable.xlsx');
};
