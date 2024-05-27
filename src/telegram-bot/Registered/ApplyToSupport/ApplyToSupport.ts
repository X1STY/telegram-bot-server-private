import { ReplayQuestionCallback } from '@/telegram-bot/ReplyQuestionCallback';
import { botMessages } from '@/telegram-bot/bot.service';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { handleError } from '@/utils';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const ApplyToSupport = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'apply_to_support') {
    return;
  }
  await sendToUser({
    bot,
    call,
    message: botMessages['ApplyToSupportMessage'].message
  });
  let message;
  try {
    message = await ReplayQuestionCallback(bot, call);
  } catch (error) {
    if (error.message === 'command') return;
    handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
  }

  await sendToUser({
    bot,
    call,
    message: 'Ваше обращение зафиксированно. Мы ответим на него как можно скорее',
    canPreviousMessageBeDeleted: false,
    keyboard: BackToRegisteredMenu()
  });

  await prisma.questionsToSupport.create({
    data: {
      message_id: message.message_id,
      question_text: message.text,
      Status: 'Waiting',
      sender_id: call.from.id,
      question_dispatch_date: new Date()
    }
  });

  const support = await prisma.user.findMany({
    where: {
      role: {
        in: ['SUPPORT', 'ADMIN']
      }
    }
  });

  const tempStorage: { [id: number]: number } = {};

  for (const agent of support) {
    if (agent.role === 'SUPPORT') {
      const supportMessage = await bot.sendMessage(
        Number(agent.telegramId),
        `✉️Новое обращение.\nОбращение от ${
          call.from.username ? '@' + call.from.username : 'Нет данных'
        }\nP.S. Чтобы ваш ответ отправился, пожалуйста, напишите сообщение-ответ при помощи функции "Ответить (Reply)" на это сообщение\n\nТекст обращения:\n` +
          message.text
      );
      tempStorage[Number(agent.telegramId)] = supportMessage.message_id;
    }
    if (agent.role === 'ADMIN') {
      const supportMessage = await bot.sendMessage(
        Number(agent.telegramId),
        `📣Новое уведомление.\nОбращение от ${
          call.from.username ? '@' + call.from.username : 'Нет данных'
        }\n\nТекст обращения:\n` + message.text
      );
      tempStorage[Number(agent.telegramId)] = supportMessage.message_id;
    }
  }

  const records = Object.entries(tempStorage).map(([supportId, supportChatId]) => ({
    message_id: message.message_id,
    message_support_chat_id: supportChatId,
    support_id: Number(supportId)
  }));

  await prisma.questionsChatIds.createMany({
    data: records
  });
};
