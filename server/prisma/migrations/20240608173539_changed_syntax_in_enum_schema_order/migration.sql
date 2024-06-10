/*
  Warnings:

  - You are about to alter the column `status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(7))`.
  - The values [VIRTUAL_ACCOUNT,GOPAY,BANK_TRANSFER,SHOPEEPAY,CREDIT_DEBIT_CARD] on the enum `orders_payment_method` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `status` ENUM('confirmed', 'pending', 'cancelled') NOT NULL DEFAULT 'pending',
    MODIFY `payment_method` ENUM('virtualaccount', 'gopay', 'bank', 'shopeepay', 'debitcard') NULL;
