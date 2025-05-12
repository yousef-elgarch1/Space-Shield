package com.debriswatch.debristracker.dto;

import lombok.Data;

@Data
public class OrbitResponseDto {
    private String objectName;
    private double latitude;
    private double longitude;
    private double altitude;

    public OrbitResponseDto(String objectName, double latitude, double longitude, double altitude) {
        this.objectName = objectName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }
}

