-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "theoryContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "theoryPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "theoryUpdatedAt" TIMESTAMP(3);
