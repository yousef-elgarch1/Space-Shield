package com.debriswatch.debristracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter; 
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
@JsonIgnoreProperties(ignoreUnknown = true)
@Setter
@Getter
@Entity
public class TleData {
    // Getters and Setters
    
    @Id
    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ordinal;

    @JsonProperty("COMMENT")
    private String comment;

    @JsonProperty("ORIGINATOR")
    private String originator;

    @JsonProperty("NORAD_CAT_ID")
    private int noradCatId;

    @JsonProperty("OBJECT_NAME")
    private String objectName;

    @JsonProperty("OBJECT_TYPE")
    private String objectType;

    @JsonProperty("CLASSIFICATION_TYPE")
    private String classificationType;

    @JsonProperty("INTLDES")
    private String intldes;

    @JsonProperty("EPOCH")
    private String epoch; // Keep as String for now

    @JsonProperty("EPOCH_MICROSECONDS")
    private long epochMicroseconds;

    @JsonProperty("MEAN_MOTION")
    private double meanMotion;

    @JsonProperty("ECCENTRICITY")
    private double eccentricity;

    @JsonProperty("INCLINATION")
    private double inclination;

    @JsonProperty("RA_OF_ASC_NODE")
    private double raOfAscNode;

    @JsonProperty("ARG_OF_PERICENTER")
    private double argOfPericenter;

    @JsonProperty("MEAN_ANOMALY")
    private double meanAnomaly;

    @JsonProperty("EPHEMERIS_TYPE")
    private int ephemerisType;

    @JsonProperty("ELEMENT_SET_NO")
    private int elementSetNo;

    @JsonProperty("REV_AT_EPOCH")
    private int revAtEpoch;

    @JsonProperty("BSTAR")
    private double bstar;

    @JsonProperty("MEAN_MOTION_DOT")
    private double meanMotionDot;

    @JsonProperty("MEAN_MOTION_DDOT")
    private double meanMotionDdot;

    @JsonProperty("FILE")
    private int file;

    @JsonProperty("TLE_LINE0")
    private String tleLine0;

    @JsonProperty("TLE_LINE1")
    private String tleLine1;

    @JsonProperty("TLE_LINE2")
    private String tleLine2;

    @JsonProperty("OBJECT_ID")
    private String objectId;

    @JsonProperty("OBJECT_NUMBER")
    private int objectNumber;

    @JsonProperty("SEMIMAJOR_AXIS")
    private double semimajorAxis;

    @JsonProperty("PERIOD")
    private double period;

    @JsonProperty("APOGEE")
    private double apogee;

    @JsonProperty("PERIGEE")
    private double perigee;

    @JsonProperty("DECAYED")
    private String decayed;

    // Getters and setters
}