/*
  Warnings:

  - Added the required column `hall_time` to the `BookingHallApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingHallApplication" ADD COLUMN     "hall_time" TEXT NOT NULL,
ALTER COLUMN "hall_date" SET DATA TYPE TEXT;
