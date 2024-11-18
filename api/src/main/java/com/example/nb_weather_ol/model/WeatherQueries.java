package com.example.nb_weather_ol.model;

import jakarta.persistence.*;

@Entity
@Table(name = "weather_queries")
public class WeatherQueries {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String query;

    @Column(nullable = false)
    private String userId;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuery() {
        return query;

    }

    public String getUserId() {
        return userId;

    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    @Override
    public String toString() {
        return "WeatherQuery{" +
                "id=" + id +
                ", query='" + query + '\'' +
                '}';
    }

}