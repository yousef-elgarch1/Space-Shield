package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.*;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

@SpringBootTest
class TleServiceTest {

    @InjectMocks
    @Spy
    private TleService tleService;

    @Mock
    private TleRepository tleRepository;

    @Mock
    private SatelliteRepository satelliteRepository;

    @Mock
    private DebrisRepository debrisRepository;

    @Mock
    private RocketBodyRepository rocketBodyRepository;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void fetchAndProcessTleData_runsSuccessfullyAndSaves() {
        try {
            // Arrange: Create fake TLE data
            TleData tle = new TleData();
            tle.setObjectName("TEST SAT");
            tle.setObjectType("PAYLOAD"); // triggers Satellite saving

            List<TleData> fakeList = Collections.singletonList(tle);

            // Act: Mock parseTleJson to avoid actual API call
            doReturn(fakeList).when(tleService).parseTleJson(anyString());

            // Act: Run the method
            tleService.fetchAndProcessTleData();

            // Assert: Verify DB interaction
            verify(tleRepository, times(1)).saveAll(anyList());
            verify(satelliteRepository, times(1)).save(any(Satellite.class));
            verify(debrisRepository, never()).save(any());
            verify(rocketBodyRepository, never()).save(any());

        } catch (Exception e) {
            e.printStackTrace();
            assert false : "Test failed due to exception: " + e.getMessage();
        }
    }
}
