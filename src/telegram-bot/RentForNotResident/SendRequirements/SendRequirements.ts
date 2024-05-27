import { ContactDataWithTitleQuestionnare } from '@/telegram-bot/Questionnaire/ContactDataWithTitle';
import { RequestedRentAreaQuestionnare } from '@/telegram-bot/Questionnaire/RequestedRentArea';
import { sendNotification } from '@/telegram-bot/Questionnaire/uitils/SendNotification';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { handleError } from '@/utils';
import { Palaces, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const RentForNotResidentSendRequirements = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_not_resident_send_requirements') {
    return;
  }
  RentForNotResidentSendRequirementsFunc(bot, call, prisma);
};

export const RentForNotResidentSendRequirementsFunc = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  chosenPalace?: Palaces
) => {
  const userData = await prisma.user.findFirst({
    include: {
      rented_area_requests_application: true,
      contact_data: true
    },
    where: {
      telegramId: call.from.id
    }
  });
  bot.answerCallbackQuery(call.id);
  // if (userData.role !== 'UNREGISTERED') {
  //   await sendToUser({
  //     bot,
  //     call,
  //     message: botMessages['RegisteredError'].message,
  //     keyboard: MainMenu()
  //   });
  //   return;
  // }
  try {
    const { areaType, areaPremises, areaRentalStart } = await RequestedRentAreaQuestionnare(
      bot,
      call
    );
    await prisma.rentedAreaRequestsApplication.create({
      data: {
        area_premises: areaPremises,
        area_type: areaType,
        area_rental_start: areaRentalStart,
        status: 'Waiting',
        user_telegramId: call.from.id,
        chosen_palace: chosenPalace,
        area_dispatch_date: new Date(),
        sended_as: 'OTHER'
      }
    });
  } catch (error) {
    if (error.message === 'command') {
      return;
    } else
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
  }

  if (!userData.contact_data) {
    try {
      const { name, phone, email, organization, title } = await ContactDataWithTitleQuestionnare(
        bot,
        call
      );
      await prisma.contactData.create({
        data: {
          name,
          email,
          phone,
          organization,
          title,
          user_telegramId: call.from.id
        }
      });
    } catch (error) {
      if (error.message === 'command') {
        return;
      } else
        handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
    }
  }
  if (userData.role === 'UNREGISTERED')
    await prisma.user.update({
      data: {
        role: 'NONRESIDENTRENTER'
      },
      where: {
        telegramId: call.from.id
      }
    });
  await sendToUser({
    bot,
    call,
    message: botMessages['ApplicationSent'].message,
    canPreviousMessageBeDeleted: false,
    keyboard: BackToRegisteredMenu()
  });
  await sendNotification(bot, prisma, { from: 'BecomeANonResidentRenter' });
};
