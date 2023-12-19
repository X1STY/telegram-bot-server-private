import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export type fromQuestionnarie = {
  from:
    | 'Booking'
    | 'Problem'
    | 'BecomeAResident'
    | 'Innovation'
    | 'BecomeANonResidentRenter'
    | 'EventRent';
};

export const sendNotification = async (
  bot: TelegramBot,
  prisma: PrismaClient,
  from: fromQuestionnarie
) => {
  let fromDefenition: string;
  switch (from.from) {
    case 'Booking': {
      fromDefenition = 'Заявка на аренду переговорки/зала от резидента';
      break;
    }
    case 'Problem': {
      fromDefenition = 'Заявка о проблеме в помещении ОЭЗ';
      break;
    }
    case 'BecomeAResident': {
      fromDefenition = 'Заявка на получение статуса резидента';
      break;
    }
    case 'BecomeANonResidentRenter': {
      fromDefenition = 'Заявка на становление арендатором-нерезидентом';
      break;
    }
    case 'EventRent': {
      fromDefenition = 'Заявка об аренде для мероприятия';
      break;
    }
    case 'Innovation': {
      fromDefenition = 'Заявка о рационализаторском предложении';
      break;
    }
  }
  const supportAgents = await prisma.user.findMany({
    where: {
      role: 'SUPPORT'
    }
  });

  for (let i = 0; i < supportAgents.length; i++) {
    try {
      await bot.sendMessage(
        Number(supportAgents[i].telegramId),
        '🔔 Новая заявка. Тема:\n' + fromDefenition
      );
    } catch (error) {
      continue;
    }
  }
};
