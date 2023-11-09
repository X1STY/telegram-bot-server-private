import { pathToImageFolder } from '@/constants';
import { BackToNorthMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const AdministrativeСenterPage = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
) => {
  if (call.data !== 'administrative_center_page') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + 'v2a.png',
    message: 'Информация об администривном корпусе',
    keyboard: BackToNorthMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
