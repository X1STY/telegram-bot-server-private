import { pathToImageFolder } from '@/constants';
import { BackToGeneralMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const ServicesAndSupportPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'services_and_support') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '3.png',
    message: `Тут контакты поддержки наверное\n Разработчик прототипа: @x1sty`,
    keyboard: BackToGeneralMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
