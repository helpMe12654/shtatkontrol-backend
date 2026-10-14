/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "telegramId" TEXT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "number" INTEGER;

-- CreateTable
CREATE TABLE "AttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "selectedText" TEXT,
    "correctOptionId" TEXT,
    "correctText" TEXT,
    "isCorrect" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_number_key" ON "Question"("number");

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptAnswer" ADD CONSTRAINT "AttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
