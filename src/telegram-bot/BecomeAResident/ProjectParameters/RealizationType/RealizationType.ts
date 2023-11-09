import { BuildingPlansQuestionnare } from '@/telegram-bot/Questionnaire/BuildingPlans';
import { ContactDataWithTitleQuestionnare } from '@/telegram-bot/Questionnaire/ContactDataWithTitle';
import { RequestedRentAreaQuestionnare } from '@/telegram-bot/Questionnaire/RequestedRentArea';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { Palaces, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const RealizationType = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (
    !(call.data.includes('realization_type_rent') || call.data.includes('realization_type_build'))
  ) {
    return;
  }
  const userData = await prisma.user.findFirst({
    include: {
      rented_area_requests_application: true,
      building_plans_application: true,
      contact_data: true
    },
    where: {
      telegramId: call.from.id
    }
  });
  if (
    call.data.includes('realization_type_rent') &&
    userData.rented_area_requests_application.length === 0 &&
    userData.building_plans_application.length === 0
  ) {
    bot.answerCallbackQuery(call.id);

    try {
      const { areaType, areaPremises, areaRentalStart } = await RequestedRentAreaQuestionnare(
        bot,
        call
      );
      const chosenPalace = Palaces[call.data.split('-')[1]];
      await prisma.rentedAreaRequestsApplication.create({
        data: {
          area_premises: areaPremises,
          area_type: areaType,
          area_rental_start: areaRentalStart,
          status: 'Waiting',
          user_telegramId: call.from.id,
          chosen_palace: chosenPalace
        }
      });
    } catch (error) {
      if (error.message === 'command') {
        return;
      } else console.log(error.message);
    }
  }

  if (
    call.data === 'realization_type_build' &&
    userData.rented_area_requests_application.length === 0 &&
    userData.building_plans_application.length === 0
  ) {
    bot.answerCallbackQuery(call.id);
    try {
      const { buildingPremises, buildingStart } = await BuildingPlansQuestionnare(bot, call);
      await prisma.buildingPlansApplication.create({
        data: {
          building_premises: buildingPremises,
          building_start: buildingStart,
          status: 'Waiting',
          user_telegramId: call.from.id
        }
      });
    } catch (error) {
      if (error.message === 'command') {
        return;
      } else console.log(error.message);
    }
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
      } else console.log(error.message);
    }
  }

  await prisma.user.update({
    data: {
      role: 'RESIDENT'
    },
    where: {
      telegramId: call.from.id
    }
  });

  await sendToUser({
    bot,
    call,
    message:
      'Ваша заявка направлена к ответственным лицам! Можете воспользоваться /registered для доступа к меню зарегестрированных пользователей',
    canPreviousMessageBeDeleted: false,
    keyboard: BackToRegisteredMenu()
  });
};