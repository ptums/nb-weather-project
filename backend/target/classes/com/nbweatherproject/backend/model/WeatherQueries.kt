package com.nbweatherproject.backend

import jakarta.persistence.*

@Entity
@Table(name = "weather_queries")
data class WeatherQueries(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name="query", nullable = false)
    var query: String = "",

    @Column(name="userId", nullable = false)
    var userId: String = ""
) {
    // No need for explicit getters and setters in Kotlin

    override fun toString(): String {
        return "WeatherQuery(id=$id, query='$query')"
    }
}
