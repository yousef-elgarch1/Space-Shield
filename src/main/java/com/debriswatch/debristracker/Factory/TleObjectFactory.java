package com.debriswatch.debristracker.Factory;

import com.debriswatch.debristracker.model.TleData;

public interface TleObjectFactory {
    TleData create(TleData tleData);  // returns a subclass
    }
