package com.debriswatch.debristracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
public class RocketBody extends TleData {
    public RocketBody(){
        super();
    }
    public RocketBody(TleData tle) {
        super.copyFrom(tle);
    }
}
