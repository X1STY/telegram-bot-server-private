import { ContactDataQuestionnare } from '@/telegram-bot/Questionnaire/ContactData';
import { ExpectationFromRentedRoomQuestionnare } from '@/telegram-bot/Questionnaire/ExpectationFromRentedRoom';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const RentForEventDescribe = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'rent_for_event_send_requirements') {
    return;
  }
  RentForEventDescribeFunc(bot, call, prisma);
};

export const RentForEventDescribeFunc = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  selectedHall?: number
) => {
  const user = await prisma.user.findFirst({
    where: { telegramId: call.from.id },
    include: { contact_data: true }
  });

  await bot.answerCallbackQuery(call.id);

  try {
    const { eventDateTime, eventSubject, eventVisitors } =
      await ExpectationFromRentedRoomQuestionnare(bot, call);

    await prisma.areaExpectationsApplication.create({
      data: {
        event_date_time: eventDateTime,
        event_subject: eventSubject,
        event_visitors: eventVisitors,
        status: 'Waiting',
        user_telegramId: call.from.id,
        chosen_hall_id: selectedHall
      }
    });
  } catch (error) {
    if (error.message === 'command') {
      return;
    } else console.log(error.message);
  }

  if (!user.contact_data || !user.contact_data.email) {
    try {
      const { email, name, phone } = await ContactDataQuestionnare(bot, call);
      await prisma.contactData.create({
        data: { email, name, phone, user_telegramId: call.from.id }
      });
    } catch (error) {
      if (error.message === 'command') {
        return;
      } else console.log(error.message);
    }
  }

  if (user.role === 'UNREGISTERED') {
    await prisma.user.update({
      data: { role: 'EVENTRENTER' },
      where: { telegramId: call.from.id }
    });
    await sendToUser({
      bot,
      call,
      message:
        'Вы зарегестрированы как арендатор для мероприятий! Можете воспользоваться /registered для доступа к меню',
      canPreviousMessageBeDeleted: false
    });
  }

  await sendToUser({
    bot,
    call,
    message: 'Ваша заявка об аренде направлена ответственным лицам!',
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
};
