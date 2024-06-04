/*
  Warnings:

  - You are about to drop the column `total_order` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `order_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `availability` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_ticket` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_ticket_id_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_event_id_fkey`;


-- AlterTable
ALTER TABLE `events` ADD COLUMN `availability` INTEGER NOT NULL,
    ADD COLUMN `ticket_price` DOUBLE NULL;

-- Set default value for existing rows
UPDATE events SET availability = 0 WHERE availability IS NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `total_order`,
    ADD COLUMN `total_price` DOUBLE NOT NULL,
    ADD COLUMN `total_ticket` INTEGER NOT NULL;

-- DropTable
DROP TABLE `order_details`;

-- DropTable
DROP TABLE `tickets`;
