import { botMessages } from '@/telegram-bot/bot.service';
import { ManageMessagesMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import TelegramBot from 'node-telegram-bot-api';

export const SeeAllMessages = async (bot: TelegramBot, call: TelegramBot.CallbackQuery) => {
  if (call.data !== 'see_all_messages') {
    return;
  }
  await bot.answerCallbackQuery(call.id);
  // const message = Object.values(botMessages)
  //   .map((entry, index) => `${index + 1}. ${entry.shortDesc}`)
  //   .join('\n');
  const chunkSize = 25;

  const messageArray = Object.values(botMessages);

  const resultArray = [];

  for (let i = 0; i < messageArray.length; i += chunkSize) {
    const chunk = messageArray.slice(i, i + chunkSize);
    const message = chunk.map((entry, index) => `${index + i + 1}. ${entry.shortDesc}`);
    resultArray.push(message.join('\n'));
  }

  for (let i = 0; i < resultArray.length; i++) {
    await sendToUser({ bot, call, message: resultArray[i], canPreviousMessageBeDeleted: false });
  }

  await sendToUser({
    bot,
    call,
    message: botMessages['AdminPanelMessage'].message,
    keyboard: ManageMessagesMenu()
  });
  return;
};
