import TelegramBot from 'node-telegram-bot-api';
import * as validator from 'validator';

export const ReplayQuestionCallback = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery | TelegramBot.Message,
  type?: string | null,
  numberRange?: [number, number] | null
): Promise<TelegramBot.Message> => {
  let responseMsg = await new Promise<TelegramBot.Message>((resolve) => {
    bot.once('message', resolve);
  });

  while (
    responseMsg.from.id !== call.from.id ||
    (type !== null && !isValidType(responseMsg.text, type, numberRange))
  ) {
    if (responseMsg.from.id === call.from.id) {
      if (type !== null) {
        if (!isValidType(responseMsg.text, type, numberRange)) {
          if (responseMsg.text.startsWith('/')) {
            throw new Error('command');
          }
          await bot.sendMessage(call.from.id, getErrorMessage(type, numberRange));
        }
      }
    }

    responseMsg = await new Promise<TelegramBot.Message>((resolve) => {
      bot.once('message', resolve);
    });
  }

  if (responseMsg.text.startsWith('/')) {
    throw new Error('command');
  }

  return responseMsg;
};

const isValidType = (
  value: string,
  type: string,
  numberRange?: [number, number] | null
): boolean => {
  switch (type) {
    case 'number':
      return (
        validator.default.isNumeric(value) && isValidNumberRange(parseFloat(value), numberRange)
      );
    case 'date':
      return validator.default.isDate(value);
    case 'email':
      return validator.default.isEmail(value);
    case 'phone':
      return validator.default.isMobilePhone(value);
    default:
      return true;
  }
};

// Helper function for sending error messages
const getErrorMessage = (type: string, numberRange?: [number, number] | null): string => {
  switch (type) {
    case 'number':
      return `Некоректный ввод данных. Введите число${
        numberRange ? ` В диапазоне от ${numberRange[0]} до ${numberRange[1]}` : ''
      }.`;
    case 'date':
      return 'Incorrect data type. Please enter a valid date.';
    case 'email':
      return 'Некоректный ввод данных. Введите почту в формате login@domain.ru';
    case 'phone':
      return 'Некоректный ввод данных. Введите номер телефона в формате 8(+7)xxxxxxxxxx';
    default:
      return 'Некоректный ввод данных.';
  }
};
const isValidNumberRange = (value: number, range: [number, number] | null): boolean =>
  range ? value >= range[0] && value <= range[1] : true;
