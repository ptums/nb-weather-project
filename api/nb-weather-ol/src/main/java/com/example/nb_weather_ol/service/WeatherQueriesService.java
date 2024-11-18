package com.example.nb_weather_ol.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nb_weather_ol.model.*;
import com.example.nb_weather_ol.repository.*;

@Service
public class WeatherQueriesService {
    private static final Logger logger = LoggerFactory.getLogger(WeatherQueriesService.class);

    private final WeatherQueriesRepository weatherQueriesRepository;

    @Autowired
    public WeatherQueriesService(WeatherQueriesRepository weatherQueriesRepository) {
        this.weatherQueriesRepository = weatherQueriesRepository;
    }

    // Create
    public WeatherQueries createWeatherQuery(WeatherQueriesRequest request) {
        logger.info("Creating or retrieving weather query entry");
        try {
            Optional<WeatherQueries> existingQuery = weatherQueriesRepository
                    .findByQueryAndUserId(request.getQuery(), request.getUserId());

            if (existingQuery.isPresent()) {
                logger.info("Existing weather query found for query: {} and userId: {}",
                        request.getQuery(), request.getUserId());
                return existingQuery.get();
            } else {
                logger.info("Creating new weather query entry for query: {} and userId: {}",
                        request.getQuery(), request.getUserId());
                return weatherQueriesRepository.save(request.getQuery(), request.getUserId());
            }
        } catch (Exception e) {
            logger.error("Error creating or retrieving weather query entry: {}", e.getMessage());
            throw new RuntimeException("Failed to create or retrieve weather query entry", e);
        }
    }

    // Read (single entry)
    public Optional<WeatherQueries> getWeatherQueryById(Long id) {
        logger.info("Fetching weather query with id: {}", id);
        try {
            return weatherQueriesRepository.findById(id);
        } catch (Exception e) {
            logger.error("Error fetching weather query with id {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to fetch weather query", e);
        }
    }

    // Read (all entries)
    public List<WeatherQueries> getAllWeatherQueries() {
        logger.info("Fetching all weather query entries");
        try {
            return weatherQueriesRepository.findAll();
        } catch (Exception e) {
            logger.error("Error fetching all weather query entries: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch all weather query entries", e);
        }
    }

    // Read all entries by user id
    public List<WeatherQueries> getAllWeatherQueriesByUserId(String userId) {
        logger.info("Fetching all weather query entries by userId");
        try {
            return weatherQueriesRepository.findAllByUserId(userId);
        } catch (Exception e) {
            logger.error("Error fetching all weather query entries: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch all weather query entries", e);
        }
    }

    // Update
    public WeatherQueries updateWeatherQuery(Long id, String query) {
        logger.info("Updating weather query with id: {}", id);
        try {
            Optional<WeatherQueries> existingWeatherQuery = weatherQueriesRepository.findById(id);
            if (existingWeatherQuery.isPresent()) {
                WeatherQueries weatherQueryToUpdate = existingWeatherQuery.get();
                // Update the fields you want to change
                weatherQueryToUpdate.setQuery(query);
                // Add more fields as necessary
                return weatherQueriesRepository.save(weatherQueryToUpdate);
            } else {
                logger.warn("Weather query with id {} not found", id);
                throw new RuntimeException("Weather query not found");
            }
        } catch (Exception e) {
            logger.error("Error updating weather query with id {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update weather query", e);
        }
    }

    // Delete
    public void deleteWeatherQuery(Long id) {
        logger.info("Deleting weather query with id: {}", id);
        try {
            if (weatherQueriesRepository.existsById(id)) {
                weatherQueriesRepository.deleteById(id);
            } else {
                logger.warn("Weather query with id {} not found", id);
                throw new RuntimeException("Weather query not found");
            }
        } catch (Exception e) {
            logger.error("Error deleting weather query with id {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete weather query", e);
        }
    }

}