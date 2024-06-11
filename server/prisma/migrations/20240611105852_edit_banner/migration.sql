/*
  Warnings:

  - Made the column `banner` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `events` MODIFY `banner` LONGBLOB NOT NULL;
