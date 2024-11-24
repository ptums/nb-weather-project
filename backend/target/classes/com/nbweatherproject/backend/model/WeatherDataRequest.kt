package com.nbweatherproject.backend

data class WeatherDataRequest(
    val query: String,
    val queryId: Long
)
