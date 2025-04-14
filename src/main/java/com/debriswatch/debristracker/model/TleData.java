package com.debriswatch.debristracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class TleData {
    // Getters and Setters
    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ordinal;
    private String comment;
    private String originator;
    private int noradCatId;
    private String objectName;
    private String objectType;
    private String classificationType;
    private String intldes;
    private LocalDateTime epoch;
    private long epochMicroseconds;
    private double meanMotion;
    private double eccentricity;
    private double inclination;
    private double raOfAscNode;
    private double argOfPericenter;
    private double meanAnomaly;
    private int ephemerisType;
    private int elementSetNo;
    private int revAtEpoch;
    private double bstar;
    private double meanMotionDot;
    private double meanMotionDdot;
    private int file;
    private String tleLine0;
    private String tleLine1;
    private String tleLine2;
    private String objectId;
    private int objectNumber;
    private double semimajorAxis;
    private double period;
    private double apogee;
    private double perigee;
    private boolean decayed;
    // Constructors
    public TleData() {
    }

    // Getters and setters
}