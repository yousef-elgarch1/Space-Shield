package com.debriswatch.debristracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
public class Satellite extends TleData {
    public Satellite(){
        super();

    }
    public Satellite(TleData tle) {
        super.copyFrom(tle);
    }
    
}

