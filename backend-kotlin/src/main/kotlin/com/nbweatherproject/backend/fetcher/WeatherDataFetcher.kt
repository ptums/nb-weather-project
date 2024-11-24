package com.nbweatherproject.backend

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.time.LocalDate
import java.time.YearMonth
import java.util.concurrent.CompletableFuture

@Service
class WeatherDataFetcher(
    private val restTemplate: RestTemplate,
    private val objectMapper: ObjectMapper
) {
    companion object {
        private val logger = LoggerFactory.getLogger(WeatherDataFetcher::class.java)
        private const val LATITUDE = 40.4862
        private const val LONGITUDE = -74.4518
        private const val BASE_URL_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive"
        private const val BASE_URL_FORECAST = "https://api.open-meteo.com/v1/forecast"
    }

    fun fetchWeatherData(month: Int, year: Int): CompletableFuture<OpenMeteoData> {
        return CompletableFuture.supplyAsync {
            val url = buildUrl(month, year)
            logger.info("API URL: {}", url)
            println(url)
            val response = fetchData(url)
            parseResponse(response)
        }
    }

    private fun buildUrl(month: Int, year: Int): String {
        val currentDate = LocalDate.now()
        val requestedYearMonth = YearMonth.of(year, month)
        val startDate = requestedYearMonth.atDay(1)

        val endDate = if (currentDate.year == year && currentDate.monthValue == month) {
            logger.debug("currentDate.monthValue == month")
            currentDate
        } else {
            logger.debug("currentDate.monthValue != month")
            requestedYearMonth.atEndOfMonth()
        }

        val baseUrl = if (endDate == currentDate) BASE_URL_FORECAST else BASE_URL_ARCHIVE

        return "$baseUrl?latitude=$LATITUDE&longitude=$LONGITUDE&start_date=$startDate&end_date=$endDate" +
                "&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max" +
                "&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto"
    }

    private fun fetchData(url: String): String {
        return restTemplate.getForObject(url, String::class.java)
            ?: throw RuntimeException("Network response was not ok")
    }

    private fun parseResponse(response: String): OpenMeteoData {
        return try {
            objectMapper.readValue(response, OpenMeteoData::class.java)
        } catch (e: Exception) {
            throw RuntimeException("Error parsing JSON response", e)
        }
    }
}

