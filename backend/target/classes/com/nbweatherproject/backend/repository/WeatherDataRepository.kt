package com.nbweatherproject.backend

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository


@Repository
interface WeatherDataRepository : JpaRepository<WeatherData, Long> {
    @Query("SELECT w FROM WeatherData w WHERE w.queryId = :queryId")
    fun findByQueryId(@Param("queryId") queryId: Long): List<WeatherData>
}