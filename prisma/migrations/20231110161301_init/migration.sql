/*
  Warnings:

  - Added the required column `event_dispatch_date` to the `AreaExpectationsApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hall_dispatch_date` to the `BookingHallApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `building_dispatch_date` to the `BuildingPlansApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innovation_dispatch_date` to the `InnovationProposalApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_dispatch_date` to the `KeyProjectParametersApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem_dispatch_date` to the `ProblemApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area_dispatch_date` to the `RentedAreaRequestsApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AreaExpectationsApplication" ADD COLUMN     "event_approval_date" TIMESTAMP(3),
ADD COLUMN     "event_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "event_support_id" INTEGER;

-- AlterTable
ALTER TABLE "BookingHallApplication" ADD COLUMN     "hall_approval_date" TIMESTAMP(3),
ADD COLUMN     "hall_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hall_support_id" INTEGER;

-- AlterTable
ALTER TABLE "BuildingPlansApplication" ADD COLUMN     "building_approval_date" TIMESTAMP(3),
ADD COLUMN     "building_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "building_support_id" INTEGER;

-- AlterTable
ALTER TABLE "InnovationProposalApplication" ADD COLUMN     "innovation_approval_date" TIMESTAMP(3),
ADD COLUMN     "innovation_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "innovation_support_id" INTEGER;

-- AlterTable
ALTER TABLE "KeyProjectParametersApplication" ADD COLUMN     "project_approval_date" TIMESTAMP(3),
ADD COLUMN     "project_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "project_support_id" INTEGER;

-- AlterTable
ALTER TABLE "ProblemApplication" ADD COLUMN     "problem_approval_date" TIMESTAMP(3),
ADD COLUMN     "problem_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "problem_support_id" INTEGER;

-- AlterTable
ALTER TABLE "RentedAreaRequestsApplication" ADD COLUMN     "area_approval_date" TIMESTAMP(3),
ADD COLUMN     "area_dispatch_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "area_support_id" INTEGER;
