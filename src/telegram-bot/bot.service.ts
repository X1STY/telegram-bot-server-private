import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { PrismaService } from 'prisma.service';
import { InfoPageAboutZone } from './InfoAboutEconomicZone/EconomicZonePage';
import { PrismaClient, User } from '@prisma/client';
import { pathToImageFolder } from '@/constants';
import { BecomeAResident } from './BecomeAResident/BecomeAResident';
import { AlreadyRegistered } from './AlreadyRegistered/AlreadyRegistered';
import { MainMenu } from './markups';
import { AdminPage, PreAdmin } from './AdminPanel/AdminPanel';
import { registerNewUser } from './RegisterNewUser';
import { MainMenuMessage } from './messages';
import { RentForEvent } from './RentForEvent/RentForEvent';
import { RentForNotResident } from './RentForNotResident/RentForNotResident';
import { ExistingOption } from './ExistingOptions/ExistingOptions';
import { PreRegistered, Registered } from './Registered/Registered';
import { PreSupport, SupportPage } from './SupportPanel/SupportPanel';
process.env['NTBA_FIX_350'] = 'true'; // anti deprecated
@Injectable()
export class BotService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit = async () => {
    await this.botMessage();
  };

  botMessage = async () => {
    const bot = new TelegramBot(process.env.BOT_API, { polling: true });
    bot.setMyCommands(commands);

    bot.onText(/\/reset/, async (msg) => {
      const id = msg.from.id;
      await this.prisma.problemApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.contactData.deleteMany({
        where: {
          user_telegramId: id
        }
      });

      await this.prisma.areaExpectationsApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.rentedAreaRequestsApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.keyProjectParametersApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.buildingPlansApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.bookingHallApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.innovationProposalApplication.deleteMany({
        where: { user_telegramId: id }
      });

      await this.prisma.user.update({
        where: { telegramId: id },
        data: { role: 'UNREGISTERED' }
      });

      await bot.sendMessage(msg.chat.id, 'successfully', {
        reply_markup: MainMenu()
      });
      return;
    });

    bot.onText(/\/registered/, async (msg) => {
      await PreRegistered(bot, msg, this.prisma);
    });
    bot.onText(/\/support/, async (msg) => {
      await PreSupport(bot, msg, this.prisma);
    });
    bot.onText(/\/admin/, async (msg) => {
      await PreAdmin(bot, msg, this.prisma);
    });
    bot.onText(/\/start/, async (msg) => {
      await registerNewUser(msg, this.prisma);

      await bot.sendPhoto(
        msg.chat.id,
        pathToImageFolder + 'Обложка.png',
        {
          reply_markup: MainMenu(),
          caption: `Здравствуйте, ${msg.from.first_name}! Добро пожаловать в бота, посвященного особой экономической зоне Томска. Здесь вы найдете актуальную информацию, а также ответы на ваши вопросы и возможность стать резидентом. Начнем наше увлекательное путешествие по миру экономических преимуществ вместе! 🚀`
        },
        {
          contentType: 'image/png',
          filename: 'filename'
        }
      );
    });
    bot.on('polling_error', (msg) => {
      console.log(msg);
    });
    bot.on('callback_query', async (call) => {
      console.log(call.from.username, call.data);
      try {
        await RentForEvent(bot, call, this.prisma);
        await InfoPageAboutZone(bot, call, this.prisma);
        await BecomeAResident(bot, call, this.prisma);
        await AlreadyRegistered(bot, call, this.prisma);
        await RentForNotResident(bot, call, this.prisma);
        await ExistingOption(bot, call, this.prisma);
        //registered
        await Registered(bot, call, this.prisma);
        //
        //admin
        await AdminPage(bot, call, this.prisma);
        //
        //support
        await SupportPage(bot, call, this.prisma);
        //
        await backToMainMenuHandler(bot, call);
      } catch (error) {
        console.log(error);
      }
    });
  };
}

export const findUserById = async (telegramId: number, prisma: PrismaClient): Promise<User> => {
  return await prisma.user.findFirst({
    where: {
      telegramId
    }
  });
};

export const backToMainMenuHandler = async (
  bot: TelegramBot,
  call: TelegramBot.CallbackQuery
): Promise<TelegramBot.Message> => {
  if (call.data !== 'to_main_menu') return;
  await bot.answerCallbackQuery(call.id);
  await MainMenuMessage(bot, call);
};

const commands = [
  {
    command: 'start',
    description: 'Запуск бота'
  },
  {
    command: 'admin',
    description: 'Авторизация в админ-панель'
  },
  {
    command: 'reset',
    description: 'Очистить данные из БД (все заявки удаляются, роль = незарегестрирован)'
  }
];
