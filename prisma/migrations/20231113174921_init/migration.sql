/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ContactData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContactData_email_key" ON "ContactData"("email");
