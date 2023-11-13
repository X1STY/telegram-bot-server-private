import { findUserById } from '@/telegram-bot/bot.service';
import { ApplicationsTypeMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { AllBookingApplications } from './AllBookingApplication/BookingApplication';
import { AllProblemApplications } from './AllBookingApplication/ProblemApplication';
import { AllEventApplications } from './AllBookingApplication/RenterApplication';
import { AllInnovationApplications } from './AllBookingApplication/InnovationApplication';
import { AllAreaApplications } from './AllBookingApplication/NonResidentRenterApplication';
import { AllResidentApplications } from './AllBookingApplication/ResidentAppliocation';

export const CheckUsersApplication = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'application_menu') {
    AllBookingApplications(bot, call, prisma);
    AllProblemApplications(bot, call, prisma);
    AllEventApplications(bot, call, prisma);
    AllInnovationApplications(bot, call, prisma);
    AllAreaApplications(bot, call, prisma);
    AllResidentApplications(bot, call, prisma);
    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }

  await sendToUser({
    bot,
    call,
    message: 'Какой тип заявок рассмотреть?',
    keyboard: ApplicationsTypeMenu()
  });
};
