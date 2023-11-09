import TelegramBot from 'node-telegram-bot-api';

export const ReplayQuestionCallback = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery | TelegramBot.Message
): Promise<TelegramBot.Message> => {
  let responseMsg = await new Promise<TelegramBot.Message>((resolve) => {
    bot.once('message', resolve);
  });
  while (responseMsg.from.id !== call.from.id) {
    responseMsg = await new Promise<TelegramBot.Message>((resolve) => {
      bot.once('message', resolve);
      console.log(responseMsg.text);
    });
  }
  if (responseMsg.text.startsWith('/')) {
    throw new Error('command');
  }
  return responseMsg;
};
