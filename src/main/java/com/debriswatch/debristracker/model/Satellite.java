package com.debriswatch.debristracker.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("SATELLITE")
@NoArgsConstructor
public class Satellite extends TleData {

    public Satellite(TleData tle) {
        super.copyFrom(tle);
    }
}
