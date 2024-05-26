/*
  Warnings:

  - You are about to alter the column `phone_number` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to drop the column `updatedAt` on the `vouchers` table. All the data in the column will be lost.
  - You are about to alter the column `voucher` on the `vouchers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the `points` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Promo` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expired_date` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `point` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `points` DROP FOREIGN KEY `points_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `promos` DROP FOREIGN KEY `promos_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `promos` DROP FOREIGN KEY `promos_user_id_fkey`;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `Promo` ENUM('10%', '25%', '50%') NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `phone_number` VARCHAR(15) NOT NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `referral_code` VARCHAR(191) NULL,
    MODIFY `reference_code` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` DROP COLUMN `updatedAt`,
    ADD COLUMN `expired_date` DATETIME(3) NOT NULL,
    ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `point` DOUBLE NOT NULL,
    MODIFY `voucher` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `points`;

-- DropTable
DROP TABLE `promos`;
