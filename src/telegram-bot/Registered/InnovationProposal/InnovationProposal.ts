import { InnovationProposalQuestionnare } from '@/telegram-bot/Questionnaire/InnovationProposal';
import { sendNotification } from '@/telegram-bot/Questionnaire/uitils/SendNotification';
import { botMessages, logger } from '@/telegram-bot/bot.service';
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
    else logger.error(call.from.username + ' | ' + call.data + ' | ' + error.message);
  }

  await sendToUser({
    bot,
    call,
    message: botMessages['ApplicationSent'].message,
    keyboard: BackToRegisteredMenu(),
    canPreviousMessageBeDeleted: false
  });
  await sendNotification(bot, prisma, { from: 'Innovation' });
};
