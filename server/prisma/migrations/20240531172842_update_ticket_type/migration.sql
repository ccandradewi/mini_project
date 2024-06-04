/*
  Warnings:

  - The values [DELUXE] on the enum `tickets_ticket_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `ticket_type` ENUM('REGULAR', 'VIP', 'FREE') NOT NULL;
