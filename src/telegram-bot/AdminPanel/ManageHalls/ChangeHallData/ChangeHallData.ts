import { DeletePhoto, SavePhoto } from '@/telegram-bot/Questionnaire/uitils/HallPhoto';
import { RentCorusel } from '@/telegram-bot/RentForEvent/RentForEventManualChoose/RentForEventManualChoose';
import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToAdminPanel, ChangeHallDataHandlerMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { handleError } from '@/utils';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const ChangeHallData = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  const Halls = await prisma.halls.findMany();
  try {
    await RentCorusel(bot, call, prisma, Halls, 0, 'change_hall_data');
  } catch (error) {
    handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);

    return;
  }
};

export const HandleChnageData = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  chosenId: number
) => {
  const hall = await prisma.halls.findFirst({
    where: {
      id: chosenId
    }
  });

  await sendToUser({
    bot,
    call,
    message: hall.description,
    photo: hall.photo_path,
    keyboard: ChangeHallDataHandlerMenu(chosenId)
  });
};

export const HandleChnageDataToChosenHall = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('manage_hall_')) {
    return;
  }
  const hall_id = call.data.split('-')[1];
  const hall = await prisma.halls.findFirst({
    where: {
      id: Number(hall_id)
    }
  });
  const hallPictureName = hall.photo_path.split('/')[hall.photo_path.split('/').length - 1];
  if (call.data.startsWith('manage_hall_delete')) {
    await prisma.halls.delete({
      where: {
        id: Number(hall_id)
      }
    });
    DeletePhoto(hall.photo_path);
    await sendToUser({ bot, call, message: 'Успешно удалено', keyboard: BackToAdminPanel() });
  }
  if (call.data.startsWith('manage_hall_change_picture')) {
    await sendToUser({ bot, call, message: botMessages['AddNewHallPhotoQuestion'].message });
    try {
      const response = await ReplayQuestionCallback(bot, call, 'photo');
      await SavePhoto(bot, response, hallPictureName);
      await sendToUser({ bot, call, message: 'Успешно изменено', keyboard: BackToAdminPanel() });
    } catch (error) {
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      return;
    }
  }
  if (call.data.startsWith('manage_hall_change_description')) {
    await sendToUser({ bot, call, message: botMessages['AddNewHallDescriptionQuestion'].message });
    try {
      const response = await ReplayQuestionCallback(bot, call);
      await prisma.halls.update({
        where: {
          id: Number(hall_id)
        },
        data: {
          description: response.text
        }
      });
      await sendToUser({ bot, call, message: 'Успешно изменено', keyboard: BackToAdminPanel() });
    } catch (error) {
      handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
      return;
    }
  }
};
