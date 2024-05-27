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
    (type !== null && !isValidType(responseMsg, type, numberRange))
  ) {
    if (responseMsg.text) {
      if (responseMsg.from.id === call.from.id) {
        if (type !== null) {
          if (!isValidType(responseMsg, type, numberRange)) {
            if (responseMsg.text.startsWith('/')) {
              throw new Error('command');
            }
            await bot.sendMessage(call.from.id, getErrorMessage(type, numberRange));
          }
        }
      }
    }
    if (responseMsg.photo) {
      console.log('@', 'sdsds');
      if (responseMsg.from.id === call.from.id) {
        if (type !== null) {
          if (!isValidType(responseMsg, type, numberRange)) {
            if (responseMsg.caption?.length > 0 && responseMsg.caption?.startsWith('/')) {
              throw new Error('command');
            }
            await bot.sendMessage(call.from.id, getErrorMessage(type, numberRange));
          }
        }
      }
    }

    responseMsg = await new Promise<TelegramBot.Message>((resolve) => {
      bot.once('message', resolve);
    });
  }

  if (
    (responseMsg.text && responseMsg.text.startsWith('/')) ||
    (responseMsg.photo && responseMsg.caption?.startsWith('/'))
  ) {
    throw new Error('command');
  }

  return responseMsg;
};

const isValidType = (
  value: TelegramBot.Message,
  type: string,
  numberRange?: [number, number] | null
): boolean => {
  switch (type) {
    case 'number':
      return (
        validator.default.isNumeric(value.text) &&
        isValidNumberRange(parseFloat(value.text), numberRange)
      );
    case 'date':
      return validator.default.isDate(value.text);
    case 'email':
      return validator.default.isEmail(value.text);
    case 'phone':
      return validator.default.isMobilePhone(value.text);
    case 'photo':
      return value.photo ? true : false;
    default:
      return true;
  }
};

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
    case 'photo':
      return 'Ожидается сообщение с фотографией';
    default:
      return 'Некоректный ввод данных.';
  }
};
const isValidNumberRange = (value: number, range: [number, number] | null): boolean =>
  range ? value >= range[0] && value <= range[1] : true;
