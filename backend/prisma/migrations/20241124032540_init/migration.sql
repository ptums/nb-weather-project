-- CreateTable
CREATE TABLE `WeatherData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `highTemp` DOUBLE NOT NULL,
    `lowTemp` DOUBLE NOT NULL,
    `weather` ENUM('CLEAR', 'MAINLY_CLEAR', 'PARTLY_CLOUDY', 'OVERCAST', 'FOG', 'DRIZZLE', 'RAIN', 'SNOW', 'RAIN_SHOWERS', 'SNOW_SHOWERS', 'THUNDERSTORM', 'UNKNOWN') NOT NULL,
    `windSpeed` DOUBLE NOT NULL,
    `queryId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeatherQueries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `query` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WeatherData` ADD CONSTRAINT `WeatherData_queryId_fkey` FOREIGN KEY (`queryId`) REFERENCES `WeatherQueries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
