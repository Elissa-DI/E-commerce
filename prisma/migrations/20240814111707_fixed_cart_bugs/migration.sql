/*
  Warnings:

  - You are about to drop the column `cartId` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "cartId",
ALTER COLUMN "quantity" DROP DEFAULT;

-- CreateTable
CREATE TABLE "_CartToCartItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CartToCartItem_AB_unique" ON "_CartToCartItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CartToCartItem_B_index" ON "_CartToCartItem"("B");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToCartItem" ADD CONSTRAINT "_CartToCartItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToCartItem" ADD CONSTRAINT "_CartToCartItem_B_fkey" FOREIGN KEY ("B") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
