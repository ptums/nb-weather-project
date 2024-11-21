package com.example.nb_weather_ol.service;

import java.time.*;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.*;
import java.util.stream.Collectors;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nb_weather_ol.fetcher.WeatherDataFetcher;
import com.example.nb_weather_ol.mapper.WeatherDataMapper;
import com.example.nb_weather_ol.model.*;
import com.example.nb_weather_ol.repository.*;

@Service
public class WeatherDataService {
    private static final Logger logger = LoggerFactory.getLogger(WeatherDataService.class);

    private final WeatherDataMapper weatherDataMapper;
    private final WeatherDataFetcher weatherDataFetcher;
    private final WeatherDataRepository weatherDataRepository;

    @Autowired
    public WeatherDataService(
            WeatherDataMapper weatherDataMapper,
            WeatherDataRepository weatherDataRepository,
            WeatherDataFetcher weatherDataFetcher) {
        this.weatherDataMapper = weatherDataMapper;
        this.weatherDataRepository = weatherDataRepository;
        this.weatherDataFetcher = weatherDataFetcher;
    }

    // Create
    public List<WeatherData> createWeatherData(String query, Long queryId) {
        String[] parts = query.split("-");
        int month, year;
        month = Integer.parseInt(parts[0]);
        year = Integer.parseInt(parts[1]);

        try {
            List<WeatherData> weatherDataList = weatherDataRepository.findByQueryId(queryId);

            if (weatherDataList.isEmpty()) {
                try {
                    logger.info("4. Create new weather data");
                    CompletableFuture<OpenMeteoData> fetchWeatherData = weatherDataFetcher.fetchWeatherData(month,
                            year);
                    OpenMeteoData openMeteoData = fetchWeatherData.get();

                    List<WeatherData> openMeteoToWeatherData = weatherDataMapper
                            .mapOpenMeteoToWeatherData(openMeteoData, queryId);

                    logger.info("Mapped {} weather data entries", openMeteoToWeatherData.size());

                    List<WeatherData> savedWeatherData = weatherDataRepository.saveAll(openMeteoToWeatherData);

                    logger.info("Successfully saved {} weather data entries",
                            savedWeatherData.size());
                    return savedWeatherData;

                } catch (InterruptedException | ExecutionException e) {
                    logger.error("Error while fetching or saving weather data", e);
                    throw new RuntimeException("Failed to fetch or save weather data", e);
                }
            }

            return weatherDataList;
        } catch (Exception e) {
            logger.error("Error creating weather data entry: {}", e.getMessage());
            throw new RuntimeException("Failed to create weather data entry", e);
        }
    }

    // Read (single weather date)
    public List<WeatherData> getWeatherDataById(Long id) {
        logger.info("Fetching weather data with query id: {}", id);
        try {
            return weatherDataRepository.findByQueryId(id);
        } catch (Exception e) {
            logger.error("Error fetching weather data with id {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to fetch weather data", e);
        }
    }

    // Read (all entries)
    public List<WeatherData> getAllWeatherData() {
        logger.info("Fetching all weather data entries");
        try {
            return weatherDataRepository.findAll();
        } catch (Exception e) {
            logger.error("Error fetching all weather data entries: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch all weather data entries", e);
        }
    }

    // Update
    public WeatherData updateWeatherData(Long id, WeatherData updatedWeatherData) {
        logger.info("Updating weather data with id: {}", id);
        try {
            Optional<WeatherData> existingWeatherData = weatherDataRepository.findById(id);
            if (existingWeatherData.isPresent()) {
                WeatherData weatherDataToUpdate = existingWeatherData.get();
                // Update the fields you want to change
                weatherDataToUpdate.setHighTemp(updatedWeatherData.getHighTemp());
                weatherDataToUpdate.setLowTemp(updatedWeatherData.getLowTemp());
                weatherDataToUpdate.setWeather(updatedWeatherData.getWeather());
                weatherDataToUpdate.setWindSpeed(updatedWeatherData.getWindSpeed());
                weatherDataToUpdate.setQueryId(updatedWeatherData.getQueryId());
                // Add more fields as necessary
                return weatherDataRepository.save(weatherDataToUpdate);
            } else {
                logger.warn("Weather data with id {} not found", id);
                throw new RuntimeException("Weather data not found");
            }
        } catch (Exception e) {
            logger.error("Error updating weather data with id {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to update weather data", e);
        }
    }

    // Delete
    public void deleteWeatherData(Long id) {
        logger.info("Deleting weather data with id: {}", id);
        try {
            if (weatherDataRepository.existsById(id)) {
                weatherDataRepository.deleteById(id);
            } else {
                logger.warn("Weather data with id {} not found", id);
                throw new RuntimeException("Weather data not found");
            }
        } catch (Exception e) {
            logger.error("Error deleting weather data with id {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete weather data", e);
        }
    }
}