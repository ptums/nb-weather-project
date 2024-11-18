package com.example.nb_weather_ol.controller;

import com.example.nb_weather_ol.model.*;
import com.example.nb_weather_ol.service.*;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wq")
public class WeatherQueriesController {
    private static final Logger logger = LoggerFactory.getLogger(WeatherDataService.class);
    private final WeatherQueriesService weatherQueriesService;

    @Autowired
    public WeatherQueriesController(WeatherQueriesService weatherQueriesService) {
        this.weatherQueriesService = weatherQueriesService;
    }

    @PostMapping
    public ResponseEntity<WeatherQueries> createWeatherQuery(@RequestBody WeatherQueriesRequest request) {
        try {
            WeatherQueries createdQuery = weatherQueriesService.createWeatherQuery(request);
            return new ResponseEntity<>(createdQuery, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeatherQueries> getWeatherQueryById(@PathVariable Long id) {
        try {
            return weatherQueriesService.getWeatherQueryById(id)
                    .map(query -> new ResponseEntity<>(query, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WeatherQueries>> getWeatherQueryByUserId(@PathVariable String userId) {
        try {
            List<WeatherQueries> weatherQueriesList = weatherQueriesService.getAllWeatherQueriesByUserId(userId);
            if (weatherQueriesList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(weatherQueriesList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<WeatherQueries>> getAllWeatherQueries() {
        try {
            List<WeatherQueries> queries = weatherQueriesService.getAllWeatherQueries();
            return new ResponseEntity<>(queries, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeatherQueries> updateWeatherQuery(@PathVariable Long id,
            @RequestBody WeatherDataRequest request) {
        try {
            WeatherQueries updatedQuery = weatherQueriesService.updateWeatherQuery(id, request.getQuery());
            return new ResponseEntity<>(updatedQuery, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Weather query not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeatherQuery(@PathVariable Long id) {
        try {
            weatherQueriesService.deleteWeatherQuery(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Weather query not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}