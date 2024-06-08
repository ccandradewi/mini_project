-- AlterTable
ALTER TABLE `orders` MODIFY `payment_method` ENUM('VIRTUAL_ACCOUNT', 'GOPAY', 'BANK_TRANSFER', 'SHOPEEPAY', 'CREDIT_DEBIT_CARD') NULL,
    MODIFY `payment_proof` LONGBLOB NULL;
