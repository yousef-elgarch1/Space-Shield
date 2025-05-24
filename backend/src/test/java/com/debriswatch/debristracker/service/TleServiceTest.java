package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.fetcher.SpaceTrackTleFetcher;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.mockito.Mockito.*;

class TleServiceTest {

    @Mock private SpaceTrackTleFetcher tleFetcher;
    @Mock private SatelliteRepository satelliteRepository;
    @Mock private DebrisRepository debrisRepository;
    @Mock private RocketBodyRepository rocketBodyRepository;
    @Mock private TleRepository tleRepository;

    private TleService tleService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Manually inject mocks so we know the service is calling our mock
        tleService = new TleService(
            tleFetcher,
            satelliteRepository,
            debrisRepository,
            rocketBodyRepository,
            tleRepository
        );
    }

    @Test
    void fetchAndProcessTleData_noException_invokesFetcherExactlyOnce() throws Exception {
        // Arrange: mock fetcher to do nothing (successful path)
        doNothing().when(tleFetcher).fetchAndProcess();

        // Act
        tleService.fetchAndProcessTleData();

        // Assert: our mock was called once, and no error path ran
        verify(tleFetcher, times(1)).fetchAndProcess();
        verifyNoMoreInteractions(tleFetcher);

        // Also assert no repository methods were called on success
        verifyNoInteractions(satelliteRepository, debrisRepository, rocketBodyRepository, tleRepository);
    }
}