-- CreateEnum
CREATE TYPE "Palaces" AS ENUM ('CIT', 'IC', 'NVC', 'EC', 'EXPOCENTER');

-- AlterTable
ALTER TABLE "RentedAreaRequestsApplication" ADD COLUMN     "chosen_palace" "Palaces";
