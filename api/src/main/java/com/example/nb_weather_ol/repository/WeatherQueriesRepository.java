package com.example.nb_weather_ol.repository;

import java.util.*;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.nb_weather_ol.model.*;

@Repository
public interface WeatherQueriesRepository extends JpaRepository<WeatherQueries, Long> {
    Optional<WeatherQueries> findByQueryAndUserId(String query, String userId);

    @Query(value = "INSERT INTO weather_queries (query, user_id) " +
            "VALUES (:query, :userId) " +
            "RETURNING *", nativeQuery = true)
    WeatherQueries save(String query, String userId);

    @Query(value = "SELECT * FROM weather_queries w WHERE w.user_id = :userId", nativeQuery = true)
    List<WeatherQueries> findAllByUserId(String userId);

    @Query(value = "SELECT * FROM weather_queries w WHERE w.query = :dateStr", nativeQuery = true)
    List<WeatherQueries> findAllByDateStr(@Param("dateStr") String dateStr);
}