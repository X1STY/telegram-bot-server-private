import { ProblemTypeConverter, StatusConvertor } from '@/constants';
import { botMessages, findUserById } from '@/telegram-bot/bot.service';
import {
  ApplicationCoruselMenu,
  ApplicationsTypeMenu,
  SupportPageMenu
} from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Prisma, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { sendNotification } from '../utils/SendNotification';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';

const category = 'Неисправности в помещениях ОЭЗ';
const prevState: { [id: number]: application } = {};
const CALLBACKDATA = `all_problem`;
type application = Prisma.ProblemApplicationGetPayload<{
  include: {
    user: {
      include: {
        contact_data: true;
      };
    };
  };
}>;

export const AllProblemApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith(`${CALLBACKDATA}`) && !call.data.startsWith('applications_problem')) {
    return;
  }
  const user = await findUserById(call.from.id, prisma);

  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const Halls = await prisma.problemApplication.findMany({
    where: {
      OR: [
        {
          status: 'Waiting'
        },
        {
          status: 'Pending',
          problem_support_id: call.from.id
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
      problem_dispatch_date: 'asc'
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
  await ProblemApplicationsCorusel(bot, call, Halls, prisma);
};

const ProblemApplicationsCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  application: application[],
  prisma: PrismaClient,
  page: number = 0
) => {
  if (prevState[call.from.id] == undefined) prevState[call.from.id] = application[0];
  if (call.data !== 'applications_problem') {
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
          application[selected].problem_application_id !==
            prevState[call.from.id].problem_application_id) ||
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

      if (prevState[call.from.id].status === 'Waiting') {
        await sendNotification(
          bot,
          Number(prevState[call.from.id].user_telegramId),
          prevState[call.from.id].problem_application_id,
          category,
          'PENDING'
        );
      }
      await prisma.problemApplication.update({
        data: {
          status: 'Pending',
          problem_support_id: call.from.id
        },
        where: {
          problem_application_id: prevState[call.from.id].problem_application_id
        }
      });
      prevState[call.from.id] = await prisma.problemApplication.findFirst({
        where: {
          problem_application_id: prevState[call.from.id].problem_application_id
        },
        include: {
          user: {
            include: {
              contact_data: true
            }
          }
        }
      });

      const message = await ProblemToLongString(prevState[call.from.id]);
      await sendToUser({
        bot,
        call,
        message,
        photo: prevState[call.from.id].photo_id,
        keyboard: ApplicationCoruselMenu(page, page, CALLBACKDATA, true, Number(selected)),
        canPreviousMessageBeDeleted: true
      });
      return;
    }

    if (call.data.startsWith(`${CALLBACKDATA}_accepted`)) {
      await sendToUser({
        bot,
        call,
        message: 'Оставьте комментарий для отправителя заявки',
        canPreviousMessageBeDeleted: false
      });
      const comment = await ReplayQuestionCallback(bot, call);
      await prisma.problemApplication.update({
        data: {
          status: 'Accepted',
          problem_support_id: call.from.id,
          problem_approval_date: new Date(),
          problem_support_comment: comment.text
        },
        where: {
          problem_application_id: prevState[call.from.id].problem_application_id
        }
      });
      await sendNotification(
        bot,
        Number(prevState[call.from.id].user_telegramId),
        prevState[call.from.id].problem_application_id,
        category,
        'ACCEPTED',
        comment.text
      );
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
      await sendToUser({
        bot,
        call,
        message: 'Оставьте комментарий для отправителя заявки',
        canPreviousMessageBeDeleted: false
      });
      const comment = await ReplayQuestionCallback(bot, call);
      await sendNotification(
        bot,
        Number(prevState[call.from.id].user_telegramId),
        prevState[call.from.id].problem_application_id,
        category,
        'DECLINED',
        comment.text
      );
      await prisma.problemApplication.update({
        data: {
          status: 'Declined',
          problem_support_id: call.from.id,
          problem_approval_date: new Date(),
          problem_support_comment: comment.text
        },
        where: {
          problem_application_id: prevState[call.from.id].problem_application_id
        }
      });

      await sendToUser({
        bot,
        call,
        message: botMessages['ProcessedApplicationMessage'].message,
        keyboard: SupportPageMenu(),
        canPreviousMessageBeDeleted: false
      });
      prevState[call.from.id] = null;
      return;
    }
  }

  const page_count = application.length - 1;
  const message = await ProblemToShortString(application[page]);
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ApplicationCoruselMenu(page, page_count, CALLBACKDATA)
  });
};

const ProblemToShortString = async (application: application): Promise<string> => {
  let resultString = '';
  resultString += `Тип проблемы: ${ProblemTypeConverter[application.problem_reason]}\n`;
  resultString += `Адрес помещения: ${application.problem_adress}\n`;
  resultString += `Статус заявки: ${StatusConvertor[application.status]}\n`;
  return resultString;
};

const ProblemToLongString = async (application: application): Promise<string> => {
  let resultString = 'Заявка о проблеме\n';
  resultString += `ID заявки: ${application.problem_application_id}\n`;
  resultString += `Тип проблемы: ${ProblemTypeConverter[application.problem_reason]}\n`;
  resultString += `Адрес помещения: ${application.problem_adress}\n`;
  resultString += `Описание проблемы: ${application.problem_main}\n`;

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
