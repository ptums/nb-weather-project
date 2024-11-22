package com.nbweatherproject.backend

data class WeatherQueryRequest(
    val query: String,
    val userId: String
)
