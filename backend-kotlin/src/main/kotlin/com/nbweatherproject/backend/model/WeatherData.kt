package com.nbweatherproject.backend

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "weather_data")
class WeatherData(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "high_temp", nullable = false)
    var highTemp: Double = 0.0,

    @Column(name = "low_temp", nullable = false)
    var lowTemp: Double = 0.0,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var weather: Weather = Weather.UNKNOWN,

    @Column(name = "wind_speed", nullable = false)
    var windSpeed: Double = 0.0,

    @Column(name = "queryId", nullable = false)
    var queryId: Long = 0,

    @Column(nullable = false)
    var date: LocalDate = LocalDate.now()
) {
    enum class Weather {
        CLEAR, MAINLY_CLEAR, PARTLY_CLOUDY, OVERCAST, FOG, DRIZZLE, RAIN, SNOW, RAIN_SHOWERS, SNOW_SHOWERS,
        THUNDERSTORM, UNKNOWN
    }
}

