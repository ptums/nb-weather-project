package com.nbweatherproject.backend

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/wq")
class WeatherQueriesController(private val weatherQueriesService: WeatherQueriesService) {

    companion object {
        private val logger = LoggerFactory.getLogger(WeatherQueriesService::class.java)
    }

    @PostMapping
    fun createWeatherQuery(@RequestBody request: WeatherQueryRequest): ResponseEntity<WeatherQueries> {
        return try {
            val createdQuery = weatherQueriesService.createWeatherQuery(request.query, request.userId)
            ResponseEntity(createdQuery, HttpStatus.CREATED)
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.BAD_REQUEST)
        }
    }

    @GetMapping("/i/{id}")
    fun getWeatherQueryById(@PathVariable id: Long): ResponseEntity<WeatherQueries> {
        return try {
            weatherQueriesService.getWeatherQueryById(id)
                .map { query -> ResponseEntity(query, HttpStatus.OK) }
                .orElse(ResponseEntity(HttpStatus.NOT_FOUND))
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @GetMapping("/u/{userId}")
    fun getWeatherQueryByUserId(@PathVariable userId: String): ResponseEntity<List<WeatherQueries>> {
        return try {
            val weatherQueriesList = weatherQueriesService.getAllWeatherQueriesByUserId(userId)
            if (weatherQueriesList.isEmpty()) {
                ResponseEntity(HttpStatus.NOT_FOUND)
            } else {
                ResponseEntity(weatherQueriesList, HttpStatus.OK)
            }
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @GetMapping
    fun getAllWeatherQueries(): ResponseEntity<List<WeatherQueries>> {
        return try {
            val queries = weatherQueriesService.getAllWeatherQueries()
            ResponseEntity(queries, HttpStatus.OK)
        } catch (e: RuntimeException) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PutMapping("/i/{id}")
    fun updateWeatherQuery(@PathVariable id: Long, @RequestBody request: WeatherQueryRequest): ResponseEntity<WeatherQueries> {
        return try {
            val updatedQuery = weatherQueriesService.updateWeatherQuery(id, request.query)
            ResponseEntity(updatedQuery, HttpStatus.OK)
        } catch (e: RuntimeException) {
            when (e.message) {
                "Weather query not found" -> ResponseEntity(HttpStatus.NOT_FOUND)
                else -> ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @DeleteMapping("/i/{id}")
    fun deleteWeatherQuery(@PathVariable id: Long): ResponseEntity<Void> {
        return try {
            weatherQueriesService.deleteWeatherQuery(id)
            ResponseEntity(HttpStatus.NO_CONTENT)
        } catch (e: RuntimeException) {
            when (e.message) {
                "Weather query not found" -> ResponseEntity(HttpStatus.NOT_FOUND)
                else -> ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    @GetMapping("/s")
    fun searchWeatherQueries(@RequestParam query: String): ResponseEntity<List<WeatherQueries>> {
        val results = weatherQueriesService.searchWeatherQueries(query)
        return ResponseEntity.ok(results)
    }
}

