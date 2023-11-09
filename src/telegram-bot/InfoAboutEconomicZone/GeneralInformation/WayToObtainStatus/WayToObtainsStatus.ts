import { pathToImageFolder } from '@/constants';
import { BackToGeneralMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const WayToObtainStatusPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'way_to_obtain_status') {
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '5.png',
    message:
      'Существуют различные пути для получения статуса в особой экономической зоне.\n\nОбычно компании и инвесторы должны подать заявку в специальные организации или органы управления ОЭЗ, предоставив детальные планы своей деятельности, прогнозы по инвестициям, ожидаемые экономические показатели.\n\nПосле рассмотрения заявки и соответствия требованиям ОЭЗ, компания может получить статус резидента ОЭЗ и начать пользоваться всеми льготами и привилегиями, предоставляемыми этой зоной.',
    keyboard: BackToGeneralMenu()
  });

  await bot.answerCallbackQuery(call.id);
};
