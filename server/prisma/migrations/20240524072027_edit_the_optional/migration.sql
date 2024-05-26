-- AlterTable
ALTER TABLE `users` MODIFY `gender` ENUM('male', 'female') NULL,
    MODIFY `dob` DATETIME(3) NULL,
    MODIFY `avatar` VARCHAR(191) NULL;
