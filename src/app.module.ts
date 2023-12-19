import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BotService } from './telegram-bot/bot.service';
import { MessageService } from './message.service';
import {} from './constants/';

@Module({
  providers: [
    PrismaService,
    BotService,
    {
      provide: MessageService,
      useValue: new MessageService('src\\constants\\botMessages.json')
    }
  ]
})
export class AppModule {}
