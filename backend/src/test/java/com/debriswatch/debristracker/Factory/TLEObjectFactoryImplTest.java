package com.debriswatch.debristracker.Factory;

import com.debriswatch.debristracker.model.Debris;
import com.debriswatch.debristracker.model.RocketBody;
import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.model.TleData;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TleObjectFactoryImplTest {

    private final TleObjectFactory factory = new TleObjectFactoryImpl();

    @Test
    void createsDebris() {
        TleData tle = new TleData();
        tle.setObjectType("DEBRIS");
        TleData obj = factory.create(tle);
        assertTrue(obj instanceof Debris);
    }

    @Test
    void createsRocketBody() {
        TleData tle = new TleData();
        tle.setObjectType("ROCKET BODY");
        TleData obj = factory.create(tle);
        assertTrue(obj instanceof RocketBody);
    }

    @Test
    void createsSatelliteForOther() {
        TleData tle = new TleData();
        tle.setObjectType("ANYTHING ELSE");
        TleData obj = factory.create(tle);
        assertTrue(obj instanceof Satellite);
    }

    @Test
    void ignoresCase() {
        TleData tle = new TleData();
        tle.setObjectType("debris");
        TleData obj = factory.create(tle);
        assertTrue(obj instanceof Debris);

        tle.setObjectType("rocket body");
        obj = factory.create(tle);
        assertTrue(obj instanceof RocketBody);
    }
}