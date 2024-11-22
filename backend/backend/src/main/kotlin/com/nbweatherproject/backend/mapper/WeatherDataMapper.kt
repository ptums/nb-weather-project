package com.nbweatherproject.backend

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.LocalDate
import com.nbweatherproject.backend.OpenMeteoData

@Component
class WeatherDataMapper {
    companion object {
        private val logger = LoggerFactory.getLogger(WeatherDataMapper::class.java)
    }

    fun mapOpenMeteoToWeatherData(data: OpenMeteoData, queryId: Long): List<WeatherData> {
        logger.info("queryId in mapper: {}", queryId)
        return data.daily.time.indices.map { index ->
            WeatherData().apply {
                date = LocalDate.parse(data.daily.time[index])
                highTemp = data.daily.temperature2mMax[index]
                lowTemp = data.daily.temperature2mMin[index]
                this.queryId = queryId
                weather = mapWeatherCode(data.daily.weathercode[index])
                windSpeed = data.daily.windspeed10mMax[index]
            }
        }
    }

    private fun mapWeatherCode(code: Int): WeatherData.Weather {
        return when (code) {
            0 -> WeatherData.Weather.CLEAR
            1, 2 -> WeatherData.Weather.MAINLY_CLEAR
            3 -> WeatherData.Weather.PARTLY_CLOUDY
            45, 48 -> WeatherData.Weather.FOG
            51, 53, 55 -> WeatherData.Weather.DRIZZLE
            61, 63, 65 -> WeatherData.Weather.RAIN
            71, 73, 75 -> WeatherData.Weather.SNOW
            80, 81, 82 -> WeatherData.Weather.RAIN_SHOWERS
            85, 86 -> WeatherData.Weather.SNOW_SHOWERS
            95, 96, 99 -> WeatherData.Weather.THUNDERSTORM
            else -> WeatherData.Weather.UNKNOWN
        }
    }
}

