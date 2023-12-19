/*
  Warnings:

  - The primary key for the `QuestionsChatIds` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AreaExpectationsApplication" ALTER COLUMN "event_support_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "BookingHallApplication" ALTER COLUMN "hall_support_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "BuildingPlansApplication" ALTER COLUMN "building_support_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "InnovationProposalApplication" ALTER COLUMN "innovation_support_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "KeyProjectParametersApplication" ALTER COLUMN "project_support_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "ProblemApplication" ALTER COLUMN "problem_support_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "QuestionsChatIds" DROP CONSTRAINT "QuestionsChatIds_pkey",
ALTER COLUMN "message_support_chat_id" SET DATA TYPE BIGINT,
ALTER COLUMN "support_id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "QuestionsChatIds_pkey" PRIMARY KEY ("message_id", "message_support_chat_id", "support_id");

-- AlterTable
ALTER TABLE "RentedAreaRequestsApplication" ALTER COLUMN "area_support_id" SET DATA TYPE BIGINT;
