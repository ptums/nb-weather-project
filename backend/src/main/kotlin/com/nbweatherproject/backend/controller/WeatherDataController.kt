package com.nbweatherproject.backend

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/wd")
class WeatherDataController(private val weatherDataService: WeatherDataService) {

    @PostMapping
    fun createWeatherData(@RequestBody request: WeatherDataRequest): ResponseEntity<List<WeatherData>> {
        return try {
            val createdData = weatherDataService.createWeatherData(request.query, request.queryId)
            ResponseEntity(createdData, HttpStatus.CREATED)
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/i/{id}")
    fun getWeatherDataById(@PathVariable id: Long): ResponseEntity<List<WeatherData>> {
        return try {
            val weatherDataList = weatherDataService.getWeatherDataById(id)
            if (weatherDataList.isEmpty()) {
                ResponseEntity(HttpStatus.NOT_FOUND)
            } else {
                ResponseEntity(weatherDataList, HttpStatus.OK)
            }
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @GetMapping
    fun getAllWeatherData(): ResponseEntity<List<WeatherData>> {
        return try {
            val allData = weatherDataService.getAllWeatherData()
            ResponseEntity(allData, HttpStatus.OK)
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}