package com.debriswatch.debristracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrbitPoint {
    private double latitude;
    private double longitude;
    private double altitude;
}
