import { BackToAdminPanel } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const CheckSupportStat = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  id?: number
) => {
  if (call.data !== 'check_support_stat' || id == null) {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const user = await prisma.user.findFirst({
    where: {
      role: 'SUPPORT',
      telegramId: id
    }
  });
  const amountProblem = await getAmount(
    prisma.problemApplication,
    'problem_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const amountInnovation = await getAmount(
    prisma.innovationProposalApplication,
    'innovation_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const amountEvent = await getAmount(
    prisma.areaExpectationsApplication,
    'event_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const amountArea = await getAmount(
    prisma.rentedAreaRequestsApplication,
    'area_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const amountKeyProj = await getAmount(
    prisma.keyProjectParametersApplication,
    'project_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const amountBook = await getAmount(
    prisma.bookingHallApplication,
    'hall_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const amountBuild = await getAmount(
    prisma.buildingPlansApplication,
    'building_support_id',
    user.telegramId,
    ['Accepted', 'Declined', 'Pending']
  );
  const message =
    formatStatString(amountProblem, 'Заявки о проблемах в ОЭЗ') +
    formatStatString(amountInnovation, 'Заявки о рационализаторских предложениях') +
    formatStatString(amountEvent, 'Заявки об аренде на мероприятия') +
    formatStatString(
      amountArea,
      'Заявки на аренду корпуса (становление резидентом или нерезидентом-арендатором)'
    ) +
    formatStatString(amountKeyProj, 'Заявки о ключевых параметрах проекта') +
    formatStatString(amountBook, 'Заявки на аренду помещений от резидентов') +
    formatStatString(amountBuild, 'Заявки на планы строительства при становлении резидентом');

  await sendToUser({ bot, call, message, keyboard: BackToAdminPanel() });
};

const getAmount = async (prismaModel, userField, userTelegramId, statusValues) =>
  await prismaModel.groupBy({
    by: ['status'],
    _count: {
      status: true
    },
    where: {
      [userField]: userTelegramId,
      status: {
        in: statusValues
      }
    }
  });
const formatStatString = (amount, from: string) => {
  const accepted = amount.find((item) => item.status === 'Accepted')?._count?.status || 0;
  const declined = amount.find((item) => item.status === 'Declined')?._count?.status || 0;
  const pending = amount.find((item) => item.status === 'Pending')?._count?.status || 0;
  const total = accepted + declined + pending;

  return `${from}:\nПринято: ${accepted}, Отклонено: ${declined}, В обработке: ${pending}, Всего: ${total}\n\n`;
};
