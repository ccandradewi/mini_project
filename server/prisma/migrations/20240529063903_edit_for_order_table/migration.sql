/*
  Warnings:

  - You are about to drop the column `category_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `payment_date` on the `order_details` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `order_details` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_date` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_proof` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_order` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_location_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_fkey`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `category_id`,
    DROP COLUMN `location_id`,
    ADD COLUMN `category` ENUM('MUSIC', 'SPORTS', 'EXHIBITION', 'CONFERENCE', 'THEATRE') NOT NULL,
    ADD COLUMN `city` ENUM('JABODETABEK', 'JAWA', 'SUMATRA', 'KALIMANTAN', 'SULAWESI', 'BALI_NUSA_TENGGARA', 'PAPUA_MALUKU') NOT NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order_details` DROP COLUMN `payment_date`,
    DROP COLUMN `payment_method`,
    ADD COLUMN `total_price` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `user_id`,
    ADD COLUMN `buyer_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `event_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `payment_date` DATETIME(3) NOT NULL,
    ADD COLUMN `payment_method` ENUM('VIRTUAL_ACCOUNT', 'GOPAY', 'BANK_TRANSFER', 'SHOPEEPAY', 'CREDIT_DEBIT_CARD') NOT NULL,
    ADD COLUMN `payment_proof` LONGBLOB NOT NULL,
    ADD COLUMN `total_order` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `bank` VARCHAR(191) NULL,
    ADD COLUMN `bankAccount` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `locations`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
