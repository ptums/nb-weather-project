/*
  Warnings:

  - You are about to alter the column `weather` on the `WeatherData` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- DropIndex
DROP INDEX `WeatherData_queryId_fkey` ON `WeatherData`;

-- AlterTable
ALTER TABLE `WeatherData` MODIFY `weather` VARCHAR(191) NOT NULL;
