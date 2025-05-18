package com.debriswatch.debristracker.model;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@DiscriminatorValue("DEBRIS")
public class Debris extends TleData {
    public Debris(){
        super();
    }
    public Debris(TleData tle) {
        super.copyFrom(tle);
    }
}

  