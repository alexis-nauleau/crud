/*
  Warnings:

  - You are about to drop the column `donne` on the `Taches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Taches" DROP COLUMN "donne",
ADD COLUMN     "Fait" BOOLEAN NOT NULL DEFAULT false;
