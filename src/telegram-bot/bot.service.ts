import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');
import { PrismaService } from 'prisma.service';
import { InfoPageAboutZone } from './InfoAboutEconomicZone/EconomicZonePage';
import { Palaces, PrismaClient, User } from '@prisma/client';
import { IUK, pathToImageFolder } from '@/constants';
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
import { HandleReplyOnQuestion } from './SupportPanel/HandleReplyOnQuestion/HandleReplyOnQuestion';
import { MessageEntry, MessageService } from '@/message.service';
import { handleError } from '@/utils';
process.env['NTBA_FIX_350'] = 'true'; // anti deprecated

export let botMessages: { [name: string]: MessageEntry } = {};
export let logger: Logger;

@Injectable()
export class BotService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService
  ) {}

  onModuleInit = async () => {
    botMessages = this.messageService.getMessages();
    logger = new Logger('bot');
    arrayOfUK = [
      {
        id: Palaces.CIT,
        photo: pathToImageFolder + 'INVENTUM.png',
        description: botMessages['CITMessage'].message
      },
      {
        id: Palaces.IC,
        photo: pathToImageFolder + 'TECHNUM.png',
        description: botMessages['ICMessage'].message
      },
      {
        id: Palaces.NVC,
        photo: pathToImageFolder + 'VITUM.png',
        description: botMessages['NVCMessage'].message
      },
      {
        id: Palaces.ADMINISTRATIVE,
        photo: pathToImageFolder + 'Administrative.png',
        description: botMessages['AdministrativePalaceMessage'].message
      }
      // {
      //   id: Palaces.EXPOCENTER,
      //   photo: pathToImageFolder + 'EXPOCENTER.png',
      //   description: botMessages['EXPOCENTERMessage'].message
      // }
    ];
    await this.botMessage();
  };

  botMessage = async () => {
    const bot = new TelegramBot(process.env.BOT_API, { polling: true });
    bot.setMyCommands(commands);

    bot.on('message', async (msg) => {
      await HandleReplyOnQuestion(bot, msg, this.prisma);
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
          caption: botMessages['mainMessage'].message,
          parse_mode: 'Markdown'
        },
        {
          contentType: 'image/png',
          filename: 'filename'
        }
      );
    });
    bot.on('polling_error', (msg) => {
      handleError('Polling error: ' + msg.message);
    });
    bot.on('callback_query', async (call) => {
      logger.debug(call.from.username + ' | ' + call.data);
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
        handleError(call.from.username + ' | ' + call.data + ' | ' + error.message + ' | ' + error);
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
    description: 'Меню администратора'
  },
  {
    command: 'registered',
    description: 'Меню для зарегестрированных пользоваетелей'
  },
  {
    command: 'support',
    description: 'Меню для агентов поддержки'
  }
];

export let arrayOfUK: IUK[];

export const updateMessage = (key: string, message: string) => {
  const service = new MessageService('src/constants/botMessages.json');
  service.updateMessage(key, message);
};
