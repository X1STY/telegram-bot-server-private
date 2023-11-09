/*
  Warnings:

  - A unique constraint covering the columns `[user_telegramId]` on the table `KeyProjectParametersApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KeyProjectParametersApplication_user_telegramId_key" ON "KeyProjectParametersApplication"("user_telegramId");
