// import { pathToImageFolder } from '@/constants';
// import { RegulatoryDocumentsMenu } from '@/telegram-bot/markups';
// import { sendToUser } from '@/telegram-bot/messages';
// import TelegramBot from 'node-telegram-bot-api';
// import { DocumentsToObtainAResidentStatus } from './DocumentsToBecomeAResident/DocumentsToBecomeAResident';
// import { botMessages } from '@/telegram-bot/bot.service';

// export const RegulatoryDocuments = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
//   if (call.data !== 'regulatory_documents') {
//     DocumentsToObtainAResidentStatus(bot, call);
//     return;
//   }

//   await sendToUser({
//     bot,
//     call,
//     photo: pathToImageFolder + '6.png',
//     message: botMessages['DocumentsMessage'].message,
//     keyboard: RegulatoryDocumentsMenu()
//   });
// };
