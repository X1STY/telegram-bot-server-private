/*
  Warnings:

  - A unique constraint covering the columns `[user_telegramId]` on the table `BuildingPlansApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_telegramId]` on the table `RentedAreaRequestsApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BuildingPlansApplication_user_telegramId_key" ON "BuildingPlansApplication"("user_telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "RentedAreaRequestsApplication_user_telegramId_key" ON "RentedAreaRequestsApplication"("user_telegramId");
