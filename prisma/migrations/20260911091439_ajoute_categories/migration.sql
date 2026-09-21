-- AlterTable
ALTER TABLE "Taches" ADD COLUMN     "categorieId" TEXT;

-- CreateTable
CREATE TABLE "Categorie" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "couleur" TEXT NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Taches" ADD CONSTRAINT "Taches_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;
