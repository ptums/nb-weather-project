package com.example.nb_weather_ol.fetcher;

import com.example.nb_weather_ol.model.OpenMeteoData;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.concurrent.CompletableFuture;

@Service
public class WeatherDataFetcher {
    private static final Logger logger = LoggerFactory.getLogger(WeatherDataFetcher.class);

    private static final double LATITUDE = 40.4862;
    private static final double LONGITUDE = -74.4518;
    private static final String BASE_URL_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";
    private static final String BASE_URL_FORECAST = "https://api.open-meteo.com/v1/forecast";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public CompletableFuture<OpenMeteoData> fetchWeatherData(int month, int year) {
        return CompletableFuture.supplyAsync(() -> {
            String url = buildUrl(month, year);
            logger.info("API URL:::", url);
            System.out.print(url);
            String response = fetchData(url);
            return parseResponse(response);
        });
    }

    private String buildUrl(int month, int year) {
        LocalDate startDate, endDate, currentDate;
        String baseUrl;

        currentDate = LocalDate.now();
        YearMonth requestedYearMonth = YearMonth.of(year, month);
        startDate = requestedYearMonth.atDay(1);

        if (currentDate.getYear() == year && currentDate.getMonthValue() == month) {
            // If it's the current month, use the current date as the end date
            logger.debug("currentDate.getMonthValue() == month");
            endDate = currentDate;
        } else {
            logger.debug("currentDate.getMonthValue() != month");
            // Otherwise, set the end date to the last day of the specified month
            endDate = requestedYearMonth.atEndOfMonth();
        }

        if (endDate.isEqual(currentDate)) {
            baseUrl = BASE_URL_FORECAST;
        } else {
            baseUrl = BASE_URL_ARCHIVE;
        }

        return String.format("%s?latitude=%.6f&longitude=%.6f&start_date=%s&end_date=%s" +
                "&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max" +
                "&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto",
                baseUrl, LATITUDE, LONGITUDE, startDate, endDate);
    }

    private String fetchData(String url) {
        String response = restTemplate.getForObject(url, String.class);
        if (response == null) {
            throw new RuntimeException("Network response was not ok");
        }
        return response;
    }

    private OpenMeteoData parseResponse(String response) {
        try {
            return objectMapper.readValue(response, OpenMeteoData.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing JSON response", e);
        }
    }
}