import TelegramBot from 'node-telegram-bot-api';
import { GeneralInfoPage } from './GeneralInformation/GeneralInformationPage';
import { InfoAboutInfrostructure } from './Infrostructure/InfrostructurePage';
import { sendToUser } from '../messages';
import { pathToImageFolder } from '@/constants';
import { InfoPageMenu } from '../markups';
// import { RegulatoryDocuments } from './RegulatoryDocuments/RegulatoryDocuments';
import { UKContactData } from './UKContactData/UKContactData';
import { PrismaClient } from '@prisma/client';
import { botMessages } from '../bot.service';

export const InfoPageAboutZone = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'learn_about_OEZ') {
    await GeneralInfoPage(bot, call);
    await InfoAboutInfrostructure(bot, call, prisma);
    //await RegulatoryDocuments(bot, call);
    await UKContactData(bot, call);
    return;
  }

  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '11.png',
    message: botMessages['learnAboutOEZMessage'].message,
    keyboard: InfoPageMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
