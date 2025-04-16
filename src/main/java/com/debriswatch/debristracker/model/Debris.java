package com.debriswatch.debristracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity

public class Debris extends TleData {
    public Debris(){
        super();
    }
}

