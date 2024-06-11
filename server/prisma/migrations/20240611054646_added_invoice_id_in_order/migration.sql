/*
  Warnings:

  - Added the required column `inv_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `inv_id` VARCHAR(191) NOT NULL;
