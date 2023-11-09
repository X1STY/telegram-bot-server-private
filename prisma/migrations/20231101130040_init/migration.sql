-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNREGISTERED', 'ADMIN', 'SUPPORT', 'RESIDENT', 'EVENTRENTER', 'EMPLOYEE', 'NONRESIDENTRENTER', 'GUEST');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Accepted', 'Declined', 'Pending', 'Waiting');

-- CreateEnum
CREATE TYPE "ProblemType" AS ENUM ('ELECTRICITY', 'WATERSUPPLY', 'HEATING', 'COMMUNICATION', 'OTHER');

-- CreateTable
CREATE TABLE "ContactData" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "organization" TEXT,
    "title" TEXT,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "ContactData_pkey" PRIMARY KEY ("user_telegramId")
);

-- CreateTable
CREATE TABLE "User" (
    "telegramId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UNREGISTERED',

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegramId")
);

-- CreateTable
CREATE TABLE "Halls" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "photo" BYTEA NOT NULL,

    CONSTRAINT "Halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemApplication" (
    "problem_application_id" SERIAL NOT NULL,
    "problem_reason" "ProblemType" NOT NULL,
    "problem_adress" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "ProblemApplication_pkey" PRIMARY KEY ("problem_application_id")
);

-- CreateTable
CREATE TABLE "AreaExpectationsApplication" (
    "event_application_id" SERIAL NOT NULL,
    "event_date_time" TEXT NOT NULL,
    "event_subject" TEXT NOT NULL,
    "event_visitors" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "AreaExpectationsApplication_pkey" PRIMARY KEY ("event_application_id")
);

-- CreateTable
CREATE TABLE "RentedAreaRequestsApplication" (
    "area_application_id" SERIAL NOT NULL,
    "area_type" TEXT NOT NULL,
    "area_premises" TEXT NOT NULL,
    "area_rental_start" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "RentedAreaRequestsApplication_pkey" PRIMARY KEY ("area_application_id")
);

-- CreateTable
CREATE TABLE "KeyProjectParametersApplication" (
    "project_appliocation_id" SERIAL NOT NULL,
    "project_stage" TEXT NOT NULL,
    "project_crew" TEXT NOT NULL,
    "project_volume" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "KeyProjectParametersApplication_pkey" PRIMARY KEY ("project_appliocation_id")
);

-- CreateTable
CREATE TABLE "BuildingPlansApplication" (
    "building_plan_id" SERIAL NOT NULL,
    "building_premises" TEXT NOT NULL,
    "building_start" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "BuildingPlansApplication_pkey" PRIMARY KEY ("building_plan_id")
);

-- CreateTable
CREATE TABLE "BookingHallApplication" (
    "hall_application_id" SERIAL NOT NULL,
    "hall_date" TIMESTAMP(3) NOT NULL,
    "hall_priod" TEXT NOT NULL,
    "hall_wish" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "BookingHallApplication_pkey" PRIMARY KEY ("hall_application_id")
);

-- CreateTable
CREATE TABLE "InnovationProposalApplication" (
    "innovation_application_id" SERIAL NOT NULL,
    "innovation_main" TEXT NOT NULL,
    "innovation_idea" TEXT NOT NULL,
    "innovation_example" TEXT NOT NULL,
    "innovation_res" TEXT NOT NULL,
    "innovation_involve" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "user_telegramId" INTEGER NOT NULL,

    CONSTRAINT "InnovationProposalApplication_pkey" PRIMARY KEY ("innovation_application_id")
);

-- AddForeignKey
ALTER TABLE "ContactData" ADD CONSTRAINT "ContactData_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemApplication" ADD CONSTRAINT "ProblemApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaExpectationsApplication" ADD CONSTRAINT "AreaExpectationsApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentedAreaRequestsApplication" ADD CONSTRAINT "RentedAreaRequestsApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyProjectParametersApplication" ADD CONSTRAINT "KeyProjectParametersApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingPlansApplication" ADD CONSTRAINT "BuildingPlansApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHallApplication" ADD CONSTRAINT "BookingHallApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InnovationProposalApplication" ADD CONSTRAINT "InnovationProposalApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
