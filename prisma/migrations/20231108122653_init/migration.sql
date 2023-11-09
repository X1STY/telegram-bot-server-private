/*
  Warnings:

  - Added the required column `problem_main` to the `ProblemApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProblemApplication" ADD COLUMN     "problem_main" TEXT NOT NULL;
