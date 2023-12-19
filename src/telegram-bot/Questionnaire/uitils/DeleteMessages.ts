import TelegramBot from 'node-telegram-bot-api';

export const deleteMessagesFromArray = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  arr: Array<TelegramBot.Message>
) => {
  for (let i = 0; i < arr.length; i++) {
    try {
      bot.deleteMessage(call.from.id, arr[i].message_id);
    } catch (error) {
      continue;
    }
  }
};
