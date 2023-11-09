import { KeyProjectParamsQuestionnare } from '@/telegram-bot/Questionnaire/KeyProjectParams';
import { sendToUser } from '@/telegram-bot/messages';
import { Palaces, PrismaClient } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { RealizationType } from './RealizationType/RealizationType';
import { BackToRegisteredMenu, RealizationTypeMenu } from '@/telegram-bot/markups';
import { findUserById } from '@/telegram-bot/bot.service';

export const ProjectParameters = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient
) => {
  if (call.data !== 'project_parameters') {
    RealizationType(bot, call, prisma);
    return;
  }
  ProjectParametersFunc(bot, call, prisma);
};

export const ProjectParametersFunc = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery,
  prisma: PrismaClient,
  chosen_palace?: Palaces
) => {
  const user = await findUserById(call.from.id, prisma);
  if (user.role !== 'UNREGISTERED') {
    await sendToUser({
      bot,
      call,
      message:
        'Вы уже зарегестрированы, и не можете снова пройти регистрацию на статус резидента!\nВоспользуйтесть /registered для доступа в меню',
      keyboard: BackToRegisteredMenu()
    });
    return;
  }
  bot.answerCallbackQuery(call.id);
  const userProject = await prisma.user.findFirst({
    include: {
      key_project_parameters_application: true,
      rented_area_requests_application: true,
      building_plans_application: true
    },
    where: {
      telegramId: call.from.id
    }
  });
  if (!userProject.key_project_parameters_application) {
    try {
      const { projectStage, projectCrew, projectValue } = await KeyProjectParamsQuestionnare(
        bot,
        call
      );
      await prisma.keyProjectParametersApplication.create({
        data: {
          project_crew: projectCrew,
          project_stage: projectStage,
          project_volume: projectValue,
          user_telegramId: call.from.id,
          status: 'Waiting'
        }
      });
    } catch (error) {
      if (error.message === 'command') {
        return;
      } else console.log(error.message);
    }
  }
  await sendToUser({
    bot,
    call,
    message: 'Какой формат реализации планируете?',
    keyboard: RealizationTypeMenu(chosen_palace),
    canPreviousMessageBeDeleted: false
  });
};