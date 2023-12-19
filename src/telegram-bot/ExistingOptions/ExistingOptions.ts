import { IUK } from '@/constants';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { sendToUser } from '../messages';
import { ExistingOptionsChooseMenu } from '../markups';
import { RentForNotResidentSendRequirementsFunc } from '../RentForNotResident/SendRequirements/SendRequirements';
import { ProjectParametersFunc } from '../BecomeAResident/ProjectParameters/ProjectParameters';
import { arrayOfUK } from '../bot.service';

export const ExistingOption = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data.startsWith('existing_options')) {
    await bot.answerCallbackQuery(call.id);
    const [from, page] = call.data.split('-')[1].split(':');

    if (call.data.includes('selected')) {
      if (from === 'RESIDENT') {
        await ProjectParametersFunc(bot, call, prisma, arrayOfUK[page].id);
      }
      if (from === 'NORESIDENT') {
        await RentForNotResidentSendRequirementsFunc(bot, call, prisma, arrayOfUK[page].id);
      }
      return;
    }

    await ExistingOptionsCorusel(
      bot,
      call,
      arrayOfUK,
      from,
      Number.isNaN(Number(page)) ? 0 : Number(page)
    );
    return;
  }
};

const ExistingOptionsCorusel = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  halls: IUK[],
  from: string,
  page: number = 0
) => {
  const page_count = halls.length - 1;
  if (page_count <= 0) {
    await sendToUser({
      bot,
      call,
      message: 'В базе данных нет помещений. Сообщите об ошибке в поддержку'
    });
    bot.answerCallbackQuery(call.id);
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: halls[page].photo,
    message: halls[page].description,
    keyboard: ExistingOptionsChooseMenu(page, page_count, from)
  });
};
