package com.nbweatherproject.backend

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ExecutionException
import com.nbweatherproject.backend.WeatherDataMapper

@Service
class WeatherDataService(
    private val weatherDataMapper: WeatherDataMapper,
    private val weatherDataRepository: WeatherDataRepository,
    private val weatherDataFetcher: WeatherDataFetcher
) {
    companion object {
        private val logger = LoggerFactory.getLogger(WeatherDataService::class.java)
    }

    // Create
    fun createWeatherData(query: String, queryId: Long): List<WeatherData> {
        val (month, year) = query.split("-").map { it.toInt() }

        return try {
            val weatherDataList = weatherDataRepository.findByQueryId(queryId)

            if (weatherDataList.isEmpty()) {
                try {
                    logger.info("4. Create new weather data")
                    val fetchWeatherData: CompletableFuture<OpenMeteoData> = weatherDataFetcher.fetchWeatherData(month, year)
                    val openMeteoData = fetchWeatherData.get()

                    val openMeteoToWeatherData = weatherDataMapper.mapOpenMeteoToWeatherData(openMeteoData, queryId)

                    logger.info("Mapped {} weather data entries", openMeteoToWeatherData.size)

                    val savedWeatherData = weatherDataRepository.saveAll(openMeteoToWeatherData)

                    logger.info("Successfully saved {} weather data entries", savedWeatherData.size)
                    savedWeatherData
                } catch (e: InterruptedException) {
                    logger.error("Error while fetching or saving weather data", e)
                    throw RuntimeException("Failed to fetch or save weather data", e)
                } catch (e: ExecutionException) {
                    logger.error("Error while fetching or saving weather data", e)
                    throw RuntimeException("Failed to fetch or save weather data", e)
                }
            } else {
                weatherDataList
            }
        } catch (e: Exception) {
            logger.error("Error creating weather data entry: {}", e.message)
            throw RuntimeException("Failed to create weather data entry", e)
        }
    }

    // Read (single weather date)
    fun getWeatherDataById(id: Long): List<WeatherData> {
        logger.info("Fetching weather data with query id: {}", id)
        return try {
            weatherDataRepository.findByQueryId(id)
        } catch (e: Exception) {
            logger.error("Error fetching weather data with id {}: {}", id, e.message)
            throw RuntimeException("Failed to fetch weather data", e)
        }
    }

    // Read (all entries)
    fun getAllWeatherData(): List<WeatherData> {
        logger.info("Fetching all weather data entries")
        return try {
            weatherDataRepository.findAll()
        } catch (e: Exception) {
            logger.error("Error fetching all weather data entries: {}", e.message)
            throw RuntimeException("Failed to fetch all weather data entries", e)
        }
    }

    // Update
    fun updateWeatherData(id: Long, updatedWeatherData: WeatherData): WeatherData {
        logger.info("Updating weather data with id: {}", id)
        return try {
            val existingWeatherData = weatherDataRepository.findById(id)
            if (existingWeatherData.isPresent) {
                val weatherDataToUpdate = existingWeatherData.get()
                // Update the fields you want to change
                weatherDataToUpdate.apply {
                    highTemp = updatedWeatherData.highTemp
                    lowTemp = updatedWeatherData.lowTemp
                    weather = updatedWeatherData.weather
                    windSpeed = updatedWeatherData.windSpeed
                    queryId = updatedWeatherData.queryId
                    // Add more fields as necessary
                }
                weatherDataRepository.save(weatherDataToUpdate)
            } else {
                logger.warn("Weather data with id {} not found", id)
                throw RuntimeException("Weather data not found")
            }
        } catch (e: Exception) {
            logger.error("Error updating weather data with id {}: {}", id, e.message)
            throw RuntimeException("Failed to update weather data", e)
        }
    }

    // Delete
    fun deleteWeatherData(id: Long) {
        logger.info("Deleting weather data with id: {}", id)
        try {
            if (weatherDataRepository.existsById(id)) {
                weatherDataRepository.deleteById(id)
            } else {
                logger.warn("Weather data with id {} not found", id)
                throw RuntimeException("Weather data not found")
            }
        } catch (e: Exception) {
            logger.error("Error deleting weather data with id {}: {}", id, e.message)
            throw RuntimeException("Failed to delete weather data", e)
        }
    }
}

