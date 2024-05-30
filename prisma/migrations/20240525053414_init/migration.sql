/*
  Warnings:

  - You are about to drop the column `genderId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `userRolesId` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Users_genderId_fkey` ON `Users`;

-- DropIndex
DROP INDEX `Users_userRolesId_fkey` ON `Users`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `genderId`,
    DROP COLUMN `userRolesId`;
