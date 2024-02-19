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
import { sendNotification } from '../utils/SendNotification';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';

const category = 'Предложения об улучшении ОЭЗ';
const prevState: { [id: number]: application } = {};
const CALLBACKDATA = `all_innovations`;
type application = Prisma.InnovationProposalApplicationGetPayload<{
  include: {
    user: {
      include: {
        contact_data: true;
      };
    };
  };
}>;

export const AllInnovationApplications = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (
    !call.data.startsWith(`${CALLBACKDATA}`) &&
    !call.data.startsWith('applications_innovation')
  ) {
    return;
  }
  const user = await findUserById(call.from.id, prisma);

  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const Halls = await prisma.innovationProposalApplication.findMany({
    where: {
      OR: [
        {
          status: 'Waiting'
        },
        {
          status: 'Pending',
          innovation_support_id: call.from.id
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
      innovation_dispatch_date: 'asc'
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
  await InnovationApplicationsCorusel(bot, call, Halls, prisma);
};

const InnovationApplicationsCorusel = async (
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
    if (call.data.startsWith(`${CALLBACKDATA}_selected`)) {
      const selected = call.data.split('-')[1];
      if (
        (application[selected] &&
          !!prevState &&
          application[selected].innovation_application_id !==
            prevState[call.from.id].innovation_application_id) ||
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
          prevState[call.from.id].innovation_application_id,
          category,
          'PENDING'
        );
      }
      await prisma.innovationProposalApplication.update({
        data: {
          status: 'Pending',
          innovation_support_id: call.from.id
        },
        where: {
          innovation_application_id: prevState[call.from.id].innovation_application_id
        }
      });
      prevState[call.from.id] = await prisma.innovationProposalApplication.findFirst({
        where: {
          innovation_application_id: prevState[call.from.id].innovation_application_id
        },
        include: {
          user: {
            include: {
              contact_data: true
            }
          }
        }
      });
      const message = await InnovationToLongString(application[selected]);
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
        prevState[call.from.id].innovation_application_id,
        category,
        'ACCEPTED',
        comment.text
      );
      await prisma.innovationProposalApplication.update({
        data: {
          status: 'Accepted',
          innovation_support_id: call.from.id,
          innovation_approval_date: new Date(),
          innovation_support_comment: comment.text
        },
        where: {
          innovation_application_id: prevState[call.from.id].innovation_application_id
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
        prevState[call.from.id].innovation_application_id,
        category,
        'DECLINED',
        comment.text
      );
      await prisma.innovationProposalApplication.update({
        data: {
          status: 'Declined',
          innovation_support_id: call.from.id,
          innovation_approval_date: new Date(),
          innovation_support_comment: comment.text
        },
        where: {
          innovation_application_id: prevState[call.from.id].innovation_application_id
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
  const message = await InnovationToShortString(application[page]);
  await sendToUser({
    bot,
    call,
    message,
    keyboard: ApplicationCoruselMenu(page, page_count, CALLBACKDATA)
  });
};

const InnovationToShortString = async (application: application): Promise<string> => {
  let resultString = '';
  resultString += `Идея рационализаторского предложения: ${application.innovation_idea}\n`;
  resultString += `Которая будет решать проблему: : ${application.innovation_main}\n`;

  resultString += `Статус заявки: ${StatusConvertor[application.status]}`;
  return resultString;
};

const InnovationToLongString = async (application: application): Promise<string> => {
  let resultString = '';
  resultString += `Идея рационализаторского предложения: ${application.innovation_main}\n`;
  resultString += `Которая будет решать проблему: : ${application.innovation_idea}\n`;
  resultString += `Идея рационализаторского предложения: ${application.innovation_example}\n`;
  resultString += `Которая будет решать проблему: : ${application.innovation_res}\n`;
  resultString += `Идея рационализаторского предложения: ${application.innovation_involve}\n`;

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
