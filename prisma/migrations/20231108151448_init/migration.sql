/*
  Warnings:

  - You are about to drop the column `hall_priod` on the `BookingHallApplication` table. All the data in the column will be lost.
  - Added the required column `hall_period` to the `BookingHallApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingHallApplication" DROP COLUMN "hall_priod",
ADD COLUMN     "hall_period" TEXT NOT NULL;
