import { pathToImageFolder } from '@/constants';
import { GeneralInfoMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';
import { ExemptionsPage } from './Exemptions/Exemptions';
import { ServicesAndSupportPage } from './ServicesAndSupport/ServicesAndSupport';
import { WayToObtainStatusPage } from './WayToObtainStatus/WayToObtainsStatus';

export const GeneralInfoPage = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'general_info') {
    await ExemptionsPage(bot, call);
    await ServicesAndSupportPage(bot, call);
    await WayToObtainStatusPage(bot, call);
    return;
  }
  await sendToUser({
    bot,
    call,
    photo: pathToImageFolder + '2.png',
    message:
      'Особые экономические зоны классифицируются по нескольким признакам.\n\nПо видам хозяйственной деятельности они могут быть торговыми зонами, промышленно-производственными зонами, технико-внедренческими зонами, сервисными зонами, офшорными зонами и комплексными зонами.\n\nПо степени организации - территориальные, анклавные, открытые, функциональные и территориально-функциональные зоны.\n\nЭти различия позволяют адаптировать ОЭЗ под различные потребности и способствуют развитию экономики в разных регионах.',
    keyboard: GeneralInfoMenu()
  });
  await bot.answerCallbackQuery(call.id);
  return;
};
