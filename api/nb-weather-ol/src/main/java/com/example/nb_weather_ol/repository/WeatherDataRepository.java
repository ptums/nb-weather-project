package com.example.nb_weather_ol.repository;

import com.example.nb_weather_ol.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    @Query("SELECT w FROM WeatherData w WHERE w.queryId = :queryId")
    List<WeatherData> findByQueryId(@Param("queryId") Long queryId);

}