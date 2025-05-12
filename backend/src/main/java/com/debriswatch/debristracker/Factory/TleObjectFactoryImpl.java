package com.debriswatch.debristracker.Factory;

import org.springframework.stereotype.Component;

import com.debriswatch.debristracker.model.Debris;
import com.debriswatch.debristracker.model.RocketBody;
import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.model.TleData;

@Component
public class TleObjectFactoryImpl implements TleObjectFactory {

    @Override
    public TleData create(TleData tleData) {
        String type = tleData.getObjectType().toUpperCase();

        return switch (type) {
            case "DEBRIS" -> new Debris(tleData);
            case "ROCKET BODY" -> new RocketBody(tleData);
            default -> new Satellite(tleData);
        };
    }

   
}
