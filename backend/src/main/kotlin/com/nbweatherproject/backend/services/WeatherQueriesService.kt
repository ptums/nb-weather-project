package com.nbweatherproject.backend

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class WeatherQueriesService(private val weatherQueriesRepository: WeatherQueriesRepository) {

    companion object {
        private val logger = LoggerFactory.getLogger(WeatherQueriesService::class.java)
    }

    // Create
    fun createWeatherQuery(query: String, userId: String): WeatherQueries {
        logger.info("Creating or retrieving weather query entry")
        return try {
            val existingQuery = weatherQueriesRepository
                .findByQueryAndUserId(query, userId)

            if (existingQuery.isPresent) {
                logger.info("Existing weather query found for query: {} and userId: {}",
                    query, userId)
                existingQuery.get()
            } else {
                logger.info("Creating new weather query entry for query: {} and userId: {}",
                    query, userId)
                weatherQueriesRepository.save(query, userId)
            }
        } catch (e: Exception) {
            logger.error("Error creating or retrieving weather query entry: {}", e.message)
            throw RuntimeException("Failed to create or retrieve weather query entry", e)
        }
    }

    // Read (single entry)
    fun getWeatherQueryById(id: Long): Optional<WeatherQueries> {
        logger.info("Fetching weather query with id: {}", id)
        return try {
            weatherQueriesRepository.findById(id)
        } catch (e: Exception) {
            logger.error("Error fetching weather query with id {}: {}", id, e.message)
            throw RuntimeException("Failed to fetch weather query", e)
        }
    }

    // Read (all entries)
    fun getAllWeatherQueries(): List<WeatherQueries> {
        logger.info("Fetching all weather query entries")
        return try {
            weatherQueriesRepository.findAll()
        } catch (e: Exception) {
            logger.error("Error fetching all weather query entries: {}", e.message)
            throw RuntimeException("Failed to fetch all weather query entries", e)
        }
    }

    // Read all entries by user id
    fun getAllWeatherQueriesByUserId(userId: String): List<WeatherQueries> {
        logger.info("Fetching all weather query entries by userId")
        return try {
            weatherQueriesRepository.findAllByUserId(userId)
        } catch (e: Exception) {
            logger.error("Error fetching all weather query entries: {}", e.message)
            throw RuntimeException("Failed to fetch all weather query entries", e)
        }
    }

    // Update
    fun updateWeatherQuery(id: Long, query: String): WeatherQueries {
        logger.info("Updating weather query with id: {}", id)
        return try {
            val existingWeatherQuery = weatherQueriesRepository.findById(id)
            if (existingWeatherQuery.isPresent) {
                val weatherQueryToUpdate = existingWeatherQuery.get()
                // Update the fields you want to change
                weatherQueryToUpdate.query = query
                // Add more fields as necessary
                weatherQueriesRepository.save(weatherQueryToUpdate)
            } else {
                logger.warn("Weather query with id {} not found", id)
                throw RuntimeException("Weather query not found")
            }
        } catch (e: Exception) {
            logger.error("Error updating weather query with id {}: {}", id, e.message)
            throw RuntimeException("Failed to update weather query", e)
        }
    }

    // Delete
    fun deleteWeatherQuery(id: Long) {
        logger.info("Deleting weather query with id: {}", id)
        try {
            if (weatherQueriesRepository.existsById(id)) {
                weatherQueriesRepository.deleteById(id)
            } else {
                logger.warn("Weather query with id {} not found", id)
                throw RuntimeException("Weather query not found")
            }
        } catch (e: Exception) {
            logger.error("Error deleting weather query with id {}: {}", id, e.message)
            throw RuntimeException("Failed to delete weather query", e)
        }
    }

    // Search
    fun searchWeatherQueries(query: String): List<WeatherQueries> {
        return weatherQueriesRepository.findByQueryContainingIgnoreCase(query)
    }
}

