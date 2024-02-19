import TelegramBot from 'node-telegram-bot-api';

export const sendNotification = async (
  bot: TelegramBot,
  sendTo: number,
  applicationId: number,
  category: string,
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED',
  comment?: string
) => {
  switch (status) {
    case 'PENDING':
      await bot.sendMessage(
        sendTo,
        `Ваша заявка №${applicationId} в категории "${category}" взята в обработку`
      );
      break;
    case 'ACCEPTED':
      await bot.sendMessage(
        sendTo,
        `Ваша заявка №${applicationId} в категории "${category}" выполнена.\nКомментарий сотрудника поддержки: ${comment}`
      );
      break;
    case 'DECLINED':
      await bot.sendMessage(
        sendTo,
        `Ваша заявка №${applicationId} в категории "${category}" отклонена.\nКомментарий сотрудника поддержки ${comment}`
      );
      break;
  }
};
