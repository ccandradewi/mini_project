/*
  Warnings:

  - Added the required column `end_time` to the `promos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `promos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `promos` ADD COLUMN `end_time` DATETIME(3) NOT NULL,
    ADD COLUMN `start_time` DATETIME(3) NOT NULL;
