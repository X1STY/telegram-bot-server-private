import TelegramBot from 'node-telegram-bot-api';
import { GeneralInfoPage } from './GeneralInformation/GeneralInformationPage';
import { InfoAboutInfrostructure } from './Infrostructure/InfrostructurePage';
import { sendToUser } from '../messages';
import { pathToImageFolder } from '@/constants';
import { InfoPageMenu } from '../markups';
import { RegulatoryDocuments } from './RegulatoryDocuments/RegulatoryDocuments';
import { UKContactData } from './UKContactData/UKContactData';
import { PrismaClient } from '@prisma/client';

export const InfoPageAboutZone = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'learn_about_OEZ') {
    await GeneralInfoPage(bot, call);
    await InfoAboutInfrostructure(bot, call, prisma);
    await RegulatoryDocuments(bot, call);
    await UKContactData(bot, call);
    return;
  }

  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '11.png',
    message:
      'Особая экономическая зона (ОЭЗ) — это географическая область в стране, где действуют особые правила для привлечения инвестиций и облегчения бизнес-процессов. ОЭЗ обычно предоставляет налоговые льготы, упрощенные процедуры таможенного контроля, а также другие преимущества для предпринимателей. Целью создания ОЭЗ является стимулирование экономического роста, привлечение иностранных инвестиций и создание новых рабочих мест.',
    keyboard: InfoPageMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
