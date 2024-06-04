/*
  Warnings:

  - You are about to drop the column `Promo` on the `events` table. All the data in the column will be lost.
  - You are about to alter the column `avatar` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(191)`.
  - Added the required column `end_promo` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_promo` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `Promo`,
    ADD COLUMN `end_promo` DATETIME(3) NOT NULL,
    ADD COLUMN `promo` ENUM('10%', '25%', '50%') NULL,
    ADD COLUMN `start_promo` DATETIME(3) NOT NULL,
    ADD COLUMN `type` ENUM('FREE', 'PAID') NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `avatar` VARCHAR(191) NULL;
