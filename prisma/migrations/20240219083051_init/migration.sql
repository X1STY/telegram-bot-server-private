-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNREGISTERED', 'ADMIN', 'SUPPORT', 'RESIDENT', 'EVENTRENTER', 'EMPLOYEE', 'NONRESIDENTRENTER', 'GUEST');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Accepted', 'Declined', 'Pending', 'Waiting');

-- CreateEnum
CREATE TYPE "ProblemType" AS ENUM ('ELECTRICITY', 'WATERSUPPLY', 'HEATING', 'COMMUNICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "Palaces" AS ENUM ('CIT', 'IC', 'NVC', 'EC', 'EXPOCENTER', 'ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "RentSender" AS ENUM ('RESIDENT', 'OTHER');

-- CreateTable
CREATE TABLE "ContactData" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "organization" TEXT,
    "title" TEXT,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "ContactData_pkey" PRIMARY KEY ("user_telegramId")
);

-- CreateTable
CREATE TABLE "User" (
    "telegramId" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UNREGISTERED',

    CONSTRAINT "User_pkey" PRIMARY KEY ("telegramId")
);

-- CreateTable
CREATE TABLE "Halls" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "photo_path" TEXT NOT NULL,

    CONSTRAINT "Halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemApplication" (
    "problem_application_id" SERIAL NOT NULL,
    "problem_reason" "ProblemType" NOT NULL,
    "problem_main" TEXT NOT NULL,
    "problem_adress" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "photo_id" TEXT,
    "problem_dispatch_date" TIMESTAMP(3) NOT NULL,
    "problem_approval_date" TIMESTAMP(3),
    "problem_support_id" BIGINT,
    "problem_support_comment" TEXT,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "ProblemApplication_pkey" PRIMARY KEY ("problem_application_id")
);

-- CreateTable
CREATE TABLE "AreaExpectationsApplication" (
    "event_application_id" SERIAL NOT NULL,
    "event_date_time" TEXT NOT NULL,
    "event_subject" TEXT NOT NULL,
    "event_visitors" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "event_dispatch_date" TIMESTAMP(3) NOT NULL,
    "event_approval_date" TIMESTAMP(3),
    "event_support_id" BIGINT,
    "event_support_comment" TEXT,
    "chosen_hall_id" INTEGER,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "AreaExpectationsApplication_pkey" PRIMARY KEY ("event_application_id")
);

-- CreateTable
CREATE TABLE "RentedAreaRequestsApplication" (
    "area_application_id" SERIAL NOT NULL,
    "area_type" TEXT NOT NULL,
    "area_premises" TEXT NOT NULL,
    "area_rental_start" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "chosen_palace" "Palaces",
    "sended_as" "RentSender" NOT NULL,
    "area_dispatch_date" TIMESTAMP(3) NOT NULL,
    "area_approval_date" TIMESTAMP(3),
    "area_support_id" BIGINT,
    "area_support_comment" TEXT,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "RentedAreaRequestsApplication_pkey" PRIMARY KEY ("area_application_id")
);

-- CreateTable
CREATE TABLE "KeyProjectParametersApplication" (
    "project_appliocation_id" SERIAL NOT NULL,
    "project_stage" TEXT NOT NULL,
    "project_crew" TEXT NOT NULL,
    "project_volume" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "project_dispatch_date" TIMESTAMP(3) NOT NULL,
    "project_approval_date" TIMESTAMP(3),
    "project_support_id" BIGINT,
    "project_support_comment" TEXT,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "KeyProjectParametersApplication_pkey" PRIMARY KEY ("project_appliocation_id")
);

-- CreateTable
CREATE TABLE "BuildingPlansApplication" (
    "building_plan_id" SERIAL NOT NULL,
    "building_premises" TEXT NOT NULL,
    "building_start" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "building_dispatch_date" TIMESTAMP(3) NOT NULL,
    "building_approval_date" TIMESTAMP(3),
    "building_support_id" BIGINT,
    "building_support_comment" TEXT,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "BuildingPlansApplication_pkey" PRIMARY KEY ("building_plan_id")
);

-- CreateTable
CREATE TABLE "BookingHallApplication" (
    "hall_application_id" SERIAL NOT NULL,
    "hall_date" TEXT NOT NULL,
    "hall_time" TEXT NOT NULL,
    "hall_period" TEXT NOT NULL,
    "hall_wish" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "hall_dispatch_date" TIMESTAMP(3) NOT NULL,
    "hall_approval_date" TIMESTAMP(3),
    "hall_support_id" BIGINT,
    "hall_support_comment" TEXT,
    "chosen_hall_id" INTEGER NOT NULL,
    "user_telegramId" BIGINT NOT NULL,

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
    "innovation_dispatch_date" TIMESTAMP(3) NOT NULL,
    "innovation_approval_date" TIMESTAMP(3),
    "innovation_support_id" BIGINT,
    "innovation_support_comment" TEXT,
    "user_telegramId" BIGINT NOT NULL,

    CONSTRAINT "InnovationProposalApplication_pkey" PRIMARY KEY ("innovation_application_id")
);

-- CreateTable
CREATE TABLE "Errors" (
    "id" SERIAL NOT NULL,
    "error" TEXT NOT NULL,

    CONSTRAINT "Errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionsToSupport" (
    "message_id" INTEGER NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "question_text" TEXT NOT NULL,
    "Status" "Status" NOT NULL,
    "answer_text" TEXT,
    "support_id" BIGINT,
    "question_dispatch_date" TIMESTAMP(3) NOT NULL,
    "question_approval_date" TIMESTAMP(3),

    CONSTRAINT "QuestionsToSupport_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "QuestionsChatIds" (
    "message_id" INTEGER NOT NULL,
    "message_support_chat_id" BIGINT NOT NULL,
    "support_id" BIGINT NOT NULL,

    CONSTRAINT "QuestionsChatIds_pkey" PRIMARY KEY ("message_id","message_support_chat_id","support_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactData_email_key" ON "ContactData"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KeyProjectParametersApplication_user_telegramId_key" ON "KeyProjectParametersApplication"("user_telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingPlansApplication_user_telegramId_key" ON "BuildingPlansApplication"("user_telegramId");

-- AddForeignKey
ALTER TABLE "ContactData" ADD CONSTRAINT "ContactData_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemApplication" ADD CONSTRAINT "ProblemApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaExpectationsApplication" ADD CONSTRAINT "AreaExpectationsApplication_chosen_hall_id_fkey" FOREIGN KEY ("chosen_hall_id") REFERENCES "Halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaExpectationsApplication" ADD CONSTRAINT "AreaExpectationsApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentedAreaRequestsApplication" ADD CONSTRAINT "RentedAreaRequestsApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyProjectParametersApplication" ADD CONSTRAINT "KeyProjectParametersApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingPlansApplication" ADD CONSTRAINT "BuildingPlansApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHallApplication" ADD CONSTRAINT "BookingHallApplication_chosen_hall_id_fkey" FOREIGN KEY ("chosen_hall_id") REFERENCES "Halls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingHallApplication" ADD CONSTRAINT "BookingHallApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InnovationProposalApplication" ADD CONSTRAINT "InnovationProposalApplication_user_telegramId_fkey" FOREIGN KEY ("user_telegramId") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsToSupport" ADD CONSTRAINT "QuestionsToSupport_support_id_fkey" FOREIGN KEY ("support_id") REFERENCES "User"("telegramId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsToSupport" ADD CONSTRAINT "QuestionsToSupport_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionsChatIds" ADD CONSTRAINT "QuestionsChatIds_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "QuestionsToSupport"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

