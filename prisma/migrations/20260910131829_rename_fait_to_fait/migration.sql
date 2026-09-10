/*
  Warnings:

  - You are about to drop the column `DateCreation` on the `Taches` table. All the data in the column will be lost.
  - You are about to drop the column `Fait` on the `Taches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Taches" DROP COLUMN "DateCreation",
DROP COLUMN "Fait",
ADD COLUMN     "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fait" BOOLEAN NOT NULL DEFAULT false;
