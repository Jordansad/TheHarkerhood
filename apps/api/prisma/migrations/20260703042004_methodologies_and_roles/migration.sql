-- CreateEnum
CREATE TYPE "MethodologyCategory" AS ENUM ('web', 'internal', 'active_directory', 'wifi', 'osint', 'ctf', 'bug_bounty');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('member', 'mentor', 'ctf_manager', 'documentation_manager', 'infrastructure_manager', 'red_team_lead', 'blue_team_lead', 'training_manager', 'co_founder', 'founder');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'member';

-- CreateTable
CREATE TABLE "Methodology" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "MethodologyCategory" NOT NULL,
    "objective" TEXT NOT NULL,
    "preparation" TEXT NOT NULL,
    "tools" TEXT[],
    "bestPractices" TEXT NOT NULL,
    "commonMistakes" TEXT NOT NULL,
    "deliverables" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Methodology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MethodologyStep" (
    "id" TEXT NOT NULL,
    "methodologyId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "MethodologyStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStepProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "checkedAt" TIMESTAMP(3),

    CONSTRAINT "UserStepProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Methodology_slug_key" ON "Methodology"("slug");

-- CreateIndex
CREATE INDEX "MethodologyStep_methodologyId_idx" ON "MethodologyStep"("methodologyId");

-- CreateIndex
CREATE INDEX "UserStepProgress_userId_idx" ON "UserStepProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStepProgress_userId_stepId_key" ON "UserStepProgress"("userId", "stepId");

-- AddForeignKey
ALTER TABLE "MethodologyStep" ADD CONSTRAINT "MethodologyStep_methodologyId_fkey" FOREIGN KEY ("methodologyId") REFERENCES "Methodology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStepProgress" ADD CONSTRAINT "UserStepProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStepProgress" ADD CONSTRAINT "UserStepProgress_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "MethodologyStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
