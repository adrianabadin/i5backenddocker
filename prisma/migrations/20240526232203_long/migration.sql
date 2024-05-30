-- AlterTable
ALTER TABLE `DataConfig` MODIFY `refreshToken` LONGTEXT NULL,
    MODIFY `facebookToken` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Photos` MODIFY `fbid` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `Posts` MODIFY `fbid` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `accessToken` LONGTEXT NULL,
    MODIFY `refreshToken` LONGTEXT NULL,
    MODIFY `fbid` LONGTEXT NULL;
