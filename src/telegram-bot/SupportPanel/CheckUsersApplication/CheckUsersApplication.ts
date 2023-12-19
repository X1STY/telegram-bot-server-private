import { botMessages, findUserById, logger } from '@/telegram-bot/bot.service';
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
    try {
      await AllBookingApplications(bot, call, prisma);
      await AllProblemApplications(bot, call, prisma);
      await AllEventApplications(bot, call, prisma);
      await AllInnovationApplications(bot, call, prisma);
      await AllAreaApplications(bot, call, prisma);
      await AllResidentApplications(bot, call, prisma);
    } catch (error) {
      logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);

      return;
    }

    return;
  }
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'SUPPORT') {
    await bot.deleteMessage(call.message.chat.id, call.message.message_id);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  await sendToUser({
    bot,
    call,
    message: botMessages['ApplicationTypeMessage'].message,
    keyboard: ApplicationsTypeMenu()
  });
};
