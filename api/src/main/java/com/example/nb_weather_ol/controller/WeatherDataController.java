package com.example.nb_weather_ol.controller;

import com.example.nb_weather_ol.model.*;
import com.example.nb_weather_ol.service.WeatherDataService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wd")
public class WeatherDataController {

    private final WeatherDataService weatherDataService;

    @Autowired
    public WeatherDataController(WeatherDataService weatherDataService) {
        this.weatherDataService = weatherDataService;
    }

    @PostMapping
    //
    public ResponseEntity<List<WeatherData>> createWeatherData(@RequestBody WeatherDataRequest request) {
        try {
            List<WeatherData> createdData = weatherDataService.createWeatherData(request.getQuery(),
                    request.getQueryId());
            return new ResponseEntity<>(createdData, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<WeatherData>> getWeatherDataById(@PathVariable Long id) {
        try {
            List<WeatherData> weatherDataList = weatherDataService.getWeatherDataById(id);
            if (weatherDataList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(weatherDataList, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<WeatherData>> getAllWeatherData() {
        try {
            List<WeatherData> allData = weatherDataService.getAllWeatherData();
            return new ResponseEntity<>(allData, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}