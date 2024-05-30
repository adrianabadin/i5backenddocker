/*
  Warnings:

  - You are about to drop the `Gender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRoles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gender` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `Users_genderId_fkey`;

-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `Users_userRolesId_fkey`;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `gender` ENUM('MALE', 'FEMALE', 'NOT_BINARY') NOT NULL,
    ADD COLUMN `rol` ENUM('GOD', 'ADMIN', 'WRITER', 'USER') NOT NULL;

-- DropTable
DROP TABLE `Gender`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `UserRoles`;
