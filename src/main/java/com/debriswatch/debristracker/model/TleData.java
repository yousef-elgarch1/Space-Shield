package com.debriswatch.debristracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Inheritance;
import lombok.Getter;
import lombok.Setter; 
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.InheritanceType; // ✅ This one is critical
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@Setter
@Getter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)//inheritance strategie 
@DiscriminatorColumn(name = "clazz_", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("TleData")
@Table(name = "tle_data")
public class TleData {
    // Getters and Setters
    
    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.AUTO)
private int idData;

    @JsonProperty("INTLDES")
    private String intldes;
    @JsonProperty("ORDINAL")

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
    @Column(nullable = true)
    @JsonProperty("APOGEE")
    private double apogee;

    @JsonProperty("PERIGEE")
    private double perigee;

    @JsonProperty("DECAYED")
    private String decayed;

    // Getters and setters
    public void copyFrom(TleData tle) {
        this.setComment(tle.getComment());
        this.setOriginator(tle.getOriginator());
        this.setNoradCatId(tle.getNoradCatId());
        this.setObjectName(tle.getObjectName());
        this.setObjectType(tle.getObjectType());
        this.setClassificationType(tle.getClassificationType());
        this.setIntldes(tle.getIntldes());
        this.setEpoch(tle.getEpoch());
        this.setEpochMicroseconds(tle.getEpochMicroseconds());
        this.setMeanMotion(tle.getMeanMotion());
        this.setEccentricity(tle.getEccentricity());
        this.setInclination(tle.getInclination());
        this.setRaOfAscNode(tle.getRaOfAscNode());
        this.setArgOfPericenter(tle.getArgOfPericenter());
        this.setMeanAnomaly(tle.getMeanAnomaly());
        this.setEphemerisType(tle.getEphemerisType());
        this.setElementSetNo(tle.getElementSetNo());
        this.setRevAtEpoch(tle.getRevAtEpoch());
        this.setBstar(tle.getBstar());
        this.setMeanMotionDot(tle.getMeanMotionDot());
        this.setMeanMotionDdot(tle.getMeanMotionDdot());
        this.setFile(tle.getFile());
        this.setTleLine0(tle.getTleLine0());
        this.setTleLine1(tle.getTleLine1());
        this.setTleLine2(tle.getTleLine2());
        this.setObjectId(tle.getObjectId());
        this.setObjectNumber(tle.getObjectNumber());
        this.setSemimajorAxis(tle.getSemimajorAxis());
        this.setPeriod(tle.getPeriod());
        this.setApogee(tle.getApogee());//set apogee
        this.setPerigee(tle.getPerigee());
        this.setDecayed(tle.getDecayed());
    }
}