import { pathToImageFolder } from '@/constants';
import { botMessages } from '@/telegram-bot/bot.service';
import { RegulatoryDocumentsToBecomeAResidentMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const DocumentsToObtainAResidentStatus = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
) => {
  if (!call.data.includes('documets_to_obtain_resident_status')) {
    return;
  }

  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '6.png',
    message: botMessages['DocumentsToObtainStatus'].message,
    keyboard: RegulatoryDocumentsToBecomeAResidentMenu(call.data.split('-')[1])
  });
};
