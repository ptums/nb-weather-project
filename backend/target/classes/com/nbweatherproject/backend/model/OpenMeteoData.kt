package com.nbweatherproject.backend
import com.fasterxml.jackson.annotation.JsonProperty

import jakarta.persistence.*


data class OpenMeteoData(
    var latitude: Double = 0.0,
    var longitude: Double = 0.0,
    @JsonProperty("generationtime_ms")
    var generationtimeMs: Double = 0.0,
    @JsonProperty("utc_offset_seconds")
    var utcOffsetSeconds: Int = 0,
    var timezone: String = "",
    @JsonProperty("timezone_abbreviation")
    var timezoneAbbreviation: String = "",
    var elevation: Int = 0,
    @JsonProperty("daily_units")
    var dailyUnits: DailyUnits = DailyUnits(),
    var daily: Daily = Daily()
) {
    data class DailyUnits(
        var time: String = "",
        @JsonProperty("temperature_2m_max")
        var temperature2mMax: String = "",
        @JsonProperty("temperature_2m_min")
        var temperature2mMin: String = "",
        var weathercode: String = "",
        @JsonProperty("windspeed_10m_max")
        var windspeed10mMax: String = ""
    )

    data class Daily(
        var time: List<String> = listOf(),
        @JsonProperty("temperature_2m_max")
        var temperature2mMax: List<Double> = listOf(),
        @JsonProperty("temperature_2m_min")
        var temperature2mMin: List<Double> = listOf(),
        var weathercode: List<Int> = listOf(),
        @JsonProperty("windspeed_10m_max")
        var windspeed10mMax: List<Double> = listOf()
    )
}