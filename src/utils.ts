import { PrismaClient } from '@prisma/client';
import { logger } from './telegram-bot/bot.service';

const prisma = new PrismaClient();

export const handleError = async (error: string) => {
  logger.error(error);
  await prisma.errors.create({
    data: {
      error: error
    }
  });
};
