import { InnovationProposalQuestionnare } from '@/telegram-bot/Questionnaire/InnovationProposal';
import { BackToRegisteredMenu } from '@/telegram-bot/markups';
import { sendToUser } from '@/telegram-bot/messages';
import { PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export const InnovationProposal = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'proposal_innovation') {
    return;
  }
  await bot.answerCallbackQuery(call.id);

  try {
    const { innovationExample, innovationIdea, innovationInvolve, innovationMain, innovationRes } =
      await InnovationProposalQuestionnare(bot, call);

    await prisma.innovationProposalApplication.create({
      data: {
        status: 'Waiting',
        innovation_example: innovationExample,
        innovation_idea: innovationIdea,
        innovation_involve: innovationInvolve,
        innovation_main: innovationMain,
        innovation_res: innovationRes,
        user_telegramId: call.from.id,
        innovation_dispatch_date: new Date()
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
