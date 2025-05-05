package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.Factory.TleObjectFactory;
import com.debriswatch.debristracker.model.*;
import com.debriswatch.debristracker.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class TleServiceTest {

    @Mock
    private SatelliteRepository satelliteRepository;

    @Mock
    private RocketBodyRepository rocketBodyRepository;

    @Mock
    private DebrisRepository debrisRepository;

    @Mock
    private TleRepository tleRepository;

    @Mock
    private TleObjectFactory tleObjectFactory;

    @InjectMocks
    private TleService tleService;

    private TleData fullSatelliteTle;
    private TleData fullDebrisTle;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        fullSatelliteTle = createFullMockTle("SATELLITE", "SAT-001");
        fullDebrisTle = createFullMockTle("DEBRIS", "DEB-999");
    }

    @Test
    void testFetchAndProcessTleData_withValidTypedObjects() throws Exception {
        List<TleData> tleList = List.of(fullSatelliteTle, fullDebrisTle);

        // Spy the service to override JSON parsing behavior
        TleService spyService = Mockito.spy(tleService);
        doReturn(tleList).when(spyService).parseTleJson(any());

        // Mock factory to return typed objects
        when(tleObjectFactory.create(fullSatelliteTle)).thenReturn(new Satellite(fullSatelliteTle));
        when(tleObjectFactory.create(fullDebrisTle)).thenReturn(new Debris(fullDebrisTle));

        // Call the method under test
        spyService.fetchAndProcessTleData();

        // Verify interactions
        verify(tleRepository, times(1)).saveAll(tleList);
        verify(satelliteRepository, times(1)).save(any(Satellite.class));
        verify(debrisRepository, times(1)).save(any(Debris.class));
        verify(rocketBodyRepository, never()).save(any(RocketBody.class));
    }

    private TleData createFullMockTle(String objectType, String objectName) {
        TleData tle = new TleData();
        tle.setIntldes("2024-001A");
        tle.setOrdinal(1);
        tle.setComment("Mock satellite");
        tle.setOriginator("NASA");
        tle.setNoradCatId(12345);
        tle.setObjectName(objectName);
        tle.setObjectType(objectType);
        tle.setClassificationType("U");
        tle.setEpoch("2024-05-05T00:00:00");
        tle.setEpochMicroseconds(System.currentTimeMillis() * 1000);
        tle.setMeanMotion(15.5);
        tle.setEccentricity(0.0001);
        tle.setInclination(98.7);
        tle.setRaOfAscNode(120.5);
        tle.setArgOfPericenter(250.1);
        tle.setMeanAnomaly(180.3);
        tle.setEphemerisType(0);
        tle.setElementSetNo(1);
        tle.setRevAtEpoch(99);
        tle.setBstar(0.000015);
        tle.setMeanMotionDot(0.00002);
        tle.setMeanMotionDdot(0.0);
        tle.setFile(999);
        tle.setTleLine0("0 " + objectName);
        tle.setTleLine1("1 12345U 98067A   24055.00000000  .00000000  00000-0  00000-0 0  9992");
        tle.setTleLine2("2 12345 098.7000 120.5000 0001000 250.1000 180.3000 15.50000000    99");
        tle.setObjectId("ID-" + objectName);
        tle.setObjectNumber(9999);
        tle.setSemimajorAxis(6871.0);
        tle.setPeriod(92.5);
        tle.setApogee(600.0);
        tle.setPerigee(590.0);
        tle.setDecayed("false");
        return tle;
    }
}
