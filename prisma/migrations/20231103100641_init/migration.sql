/*
  Warnings:

  - Added the required column `chosen_hall_id` to the `AreaExpectationsApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AreaExpectationsApplication" ADD COLUMN     "chosen_hall_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AreaExpectationsApplication" ADD CONSTRAINT "AreaExpectationsApplication_chosen_hall_id_fkey" FOREIGN KEY ("chosen_hall_id") REFERENCES "Halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;