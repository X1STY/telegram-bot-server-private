/*
  Warnings:

  - Added the required column `sended_as` to the `RentedAreaRequestsApplication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RentSender" AS ENUM ('RESIDENT', 'OTHER');

-- AlterTable
ALTER TABLE "RentedAreaRequestsApplication" ADD COLUMN     "sended_as" "RentSender" NOT NULL;
