package com.example.nb_weather_ol.model;

public class WeatherQueriesRequest {
    private String query;
    private String userId;

    // Default constructor
    public WeatherQueriesRequest() {
    }

    // Constructor with parameters
    public WeatherQueriesRequest(String query, String userId) {
        this.query = query;
        this.userId = userId;
    }

    // Getters and setters
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
