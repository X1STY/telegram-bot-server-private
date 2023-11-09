-- DropForeignKey
ALTER TABLE "AreaExpectationsApplication" DROP CONSTRAINT "AreaExpectationsApplication_chosen_hall_id_fkey";

-- AlterTable
ALTER TABLE "AreaExpectationsApplication" ALTER COLUMN "chosen_hall_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AreaExpectationsApplication" ADD CONSTRAINT "AreaExpectationsApplication_chosen_hall_id_fkey" FOREIGN KEY ("chosen_hall_id") REFERENCES "Halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
