import { pathToImageFolder } from '@/constants';
import { ProblemsInOEZQuestionnare } from '@/telegram-bot/Questionnaire/ProblemsInOEZ';
import { BackToRegisteredMenu, SendProblemMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient, ProblemType } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const SendAProblem = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'send_problem_report') {
    handleReport(bot, call, prisma);
    return;
  }
  await bot.answerCallbackQuery(call.id);

  await sendToUser({
    bot,
    call,
    message: 'Выберете тип проблемы о которой хоитите сообщить и ответьте на дальнейшие вопросы',
    photo: pathToImageFolder + '21.png',
    keyboard: SendProblemMenu()
  });
};

export const handleReport = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (!call.data.startsWith('problem_report-')) {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  const problemType = ProblemType[call.data.split('-')[1]];
  try {
    const { problemMain, problemAdress } = await ProblemsInOEZQuestionnare(bot, call);
    await prisma.problemApplication.create({
      data: {
        problem_reason: problemType,
        problem_adress: problemAdress,
        problem_main: problemMain,
        status: 'Waiting',
        user_telegramId: call.from.id,
        problem_dispatch_date: new Date()
      }
    });
  } catch (error) {
    if (error.message === 'command') return;
    else console.log(error.message);
  }
  await sendToUser({
    bot,
    call,
    message: 'Отправлено!',
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
};
