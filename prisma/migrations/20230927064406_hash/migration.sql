/*
  Warnings:

  - You are about to drop the column `hasha` on the `user` table. All the data in the column will be lost.
  - Added the required column `hash` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "hasha",
ADD COLUMN     "hash" TEXT NOT NULL;
