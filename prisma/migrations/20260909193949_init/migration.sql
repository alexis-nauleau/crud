-- CreateTable
CREATE TABLE "Taches" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "donne" BOOLEAN NOT NULL DEFAULT false,
    "DateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Taches_pkey" PRIMARY KEY ("id")
);
