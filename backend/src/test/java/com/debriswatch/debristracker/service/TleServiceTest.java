package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.fetcher.SpaceTrackTleFetcher;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class TleServiceTest {

    @Mock private SpaceTrackTleFetcher tleFetcher;
    @Mock private SatelliteRepository satelliteRepository;
    @Mock private DebrisRepository debrisRepository;
    @Mock private RocketBodyRepository rocketBodyRepository;
    @Mock private TleRepository tleRepository;

    private TleService tleService;

    @BeforeEach
    void setUp() {
        tleService = new TleService(
                tleFetcher,
                satelliteRepository,
                debrisRepository,
                rocketBodyRepository,
                tleRepository
        );
    }

    @Test
    void fetchAndProcessTleData_callsFetcher() throws Exception {
        // Arrange
        doNothing().when(tleFetcher).fetchAndProcess();

        // Act
        tleService.fetchAndProcessTleData();

        // Assert
        verify(tleFetcher, times(1)).fetchAndProcess();
    }

    @Test
    void fetchAndProcessTleData_handlesExceptionGracefully() throws Exception {
        // Arrange
        doThrow(new RuntimeException("TLE fetch failed")).when(tleFetcher).fetchAndProcess();

        // Act
        tleService.fetchAndProcessTleData();

        // Assert
        verify(tleFetcher, times(1)).fetchAndProcess();
        // No exception should be thrown; error should be printed
    }

    @Test
    void clearAllTleRelatedData_deletesAllEntitiesInOrder() {
        // Act
        tleService.clearAllTleRelatedData();

        // Assert
        verify(satelliteRepository).deleteAllSatellites();
        verify(debrisRepository).deleteAllDebris();
        verify(rocketBodyRepository).deleteAllRocketBodies();
        verify(tleRepository).deleteAllTleData();
    }
}
