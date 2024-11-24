package com.nbweatherproject.backend

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface WeatherQueriesRepository : JpaRepository<WeatherQueries, Long> {
    fun findByQueryAndUserId(query: String, userId: String): Optional<WeatherQueries>

    @Query(value = "INSERT INTO weather_queries (query, user_id) " +
            "VALUES (:query, :userId) " +
            "RETURNING *", nativeQuery = true)
    fun save(@Param("query") query: String, @Param("userId") userId: String): WeatherQueries

    @Query(value = "SELECT * FROM weather_queries w WHERE w.user_id = :userId", nativeQuery = true)
    fun findAllByUserId(@Param("userId") userId: String): List<WeatherQueries>

    fun findByQueryContainingIgnoreCase(query: String): List<WeatherQueries>
}

