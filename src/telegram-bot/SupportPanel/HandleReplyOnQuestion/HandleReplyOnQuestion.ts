import { findUserById, logger } from '@/telegram-bot/bot.service';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const HandleReplyOnQuestion = async (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  prisma: PrismaClient
) => {
  if (!msg.reply_to_message || !msg.reply_to_message?.text?.includes('Новое обращение')) {
    return;
  }
  const user = await findUserById(msg.from.id, prisma);
  if (user.role !== 'SUPPORT') {
    return;
  }

  const question = await prisma.questionsChatIds.findFirst({
    where: {
      message_support_chat_id: msg.reply_to_message.message_id,
      support_id: msg.from.id
    },
    include: {
      question: true
    }
  });

  if (question?.question && question?.question?.Status !== 'Waiting') {
    bot.sendMessage(msg.from.id, 'К сожалению, на вопрос ответил другой сотрудник поддержки');
    bot.deleteMessage(msg.from.id, msg.message_id);
    return;
  }

  await prisma.questionsToSupport.update({
    data: {
      Status: 'Accepted',
      support_id: msg.from.id,
      answer_text: msg.text,
      question_approval_date: new Date()
    },
    where: {
      message_id: question.message_id
    }
  });

  const supportChats = await prisma.questionsChatIds.findMany({
    where: {
      message_id: question.message_id
    }
  });
  const admins = await prisma.user.findMany({
    where: {
      role: 'ADMIN'
    }
  });
  const adminsArray = admins.map((user) => Number(user.telegramId));
  await bot.sendMessage(msg.from.id, 'Ваш ответ зафиксирован и отправлен пользователю');

  for (let i = 0; i < supportChats.length; i++) {
    try {
      if (!adminsArray.includes(Number(supportChats[i].support_id))) {
        await bot.deleteMessage(
          Number(supportChats[i].support_id),
          Number(supportChats[i].message_support_chat_id)
        );
      } else {
        const sender = await prisma.user.findFirst({
          select: {
            username: true
          },
          where: {
            telegramId: question.question.sender_id
          }
        });
        await bot.editMessageText(
          `📣Новое уведомление.\nОбращение от ${
            sender.username ? '@' + sender.username : 'Нет данных'
          }\n\nТекст обращения:\n` +
            question.question.question_text +
            `\n\nВопрос отвечен сотрудником поддержки ${
              msg.from.username ? '@' + msg.from.username : 'ID: ' + msg.from.id
            }\nОтвет: ${msg.text}`,
          {
            chat_id: Number(supportChats[i].support_id),
            message_id: Number(supportChats[i].message_support_chat_id)
          }
        );
      }
    } catch (error) {
      logger.error(msg.from.username + ' | ' + msg.text + ' | ' + error.message);
      continue;
    }
  }

  await bot.sendMessage(
    Number(question.question.sender_id),
    '💌 Ответ от поддержки.\nТекст сообщения: \n' + msg.text,
    {
      reply_to_message_id: question.message_id
    }
  );

  await prisma.questionsChatIds.deleteMany({
    where: {
      message_id: question.message_id
    }
  });
  await bot.deleteMessage(msg.from.id, msg.message_id);
};
