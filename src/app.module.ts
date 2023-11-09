import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BotService } from './telegram-bot/bot.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, BotService, AppService]
})
export class AppModule {}
