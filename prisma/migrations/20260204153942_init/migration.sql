/*
  Warnings:

  - You are about to drop the column `isOpen` on the `rasmlar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rasmlar" DROP COLUMN "isOpen",
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "rasmlar_access" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "rasmId" INTEGER NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rasmlar_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rasmlar_access_userId_rasmId_key" ON "rasmlar_access"("userId", "rasmId");

-- AddForeignKey
ALTER TABLE "rasmlar_access" ADD CONSTRAINT "rasmlar_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rasmlar_access" ADD CONSTRAINT "rasmlar_access_rasmId_fkey" FOREIGN KEY ("rasmId") REFERENCES "rasmlar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
