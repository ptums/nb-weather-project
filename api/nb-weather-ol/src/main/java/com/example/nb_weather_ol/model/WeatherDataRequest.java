package com.example.nb_weather_ol.model;

public class WeatherDataRequest {
    private String query;
    private Long queryId;

    // Default constructor
    public WeatherDataRequest() {
    }

    // Constructor with parameters
    public WeatherDataRequest(String query, Long queryId) {
        this.query = query;
        this.queryId = queryId;
    }

    // Getters and setters
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Long getQueryId() {
        return queryId;
    }

    public void setQueryId(Long queryId) {
        this.queryId = queryId;
    }

}