package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.fetcher.SpaceTrackTleFetcher;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({ MockitoExtension.class, OutputCaptureExtension.class })
class TleServiceTest {

    @Mock
    private SpaceTrackTleFetcher tleFetcher;
    @Mock
    private SatelliteRepository satelliteRepository;
    @Mock
    private DebrisRepository debrisRepository;
    @Mock
    private RocketBodyRepository rocketBodyRepository;
    @Mock
    private TleRepository tleRepository;

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
    void fetchAndProcessTleData_callsFetcher() {
        // Arrange
        try {
            doNothing().when(tleFetcher).fetchAndProcess();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Act & Assert (no exception)
        assertDoesNotThrow(() -> tleService.fetchAndProcessTleData());

        // Verify fetch was called exactly once
        try {
            verify(tleFetcher, times(1)).fetchAndProcess();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    @Test
    void fetchAndProcessTleData_handlesExceptionGracefully(CapturedOutput output) throws Exception {
        // Arrange: Make the fetcher throw
        RuntimeException failure = new RuntimeException("TLE fetch failed");
        try {
            doThrow(failure).when(tleFetcher).fetchAndProcess();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        // Act & Assert: should not re-throw
        assertDoesNotThrow(() -> tleService.fetchAndProcessTleData());

        // Verify the fetch was still called
        verify(tleFetcher, times(1)).fetchAndProcess();

        // And that the error was printed to stderr
        String err = output.getErr();
        assertTrue(
            err.contains("Failed to fetch TLE data: TLE fetch failed"),
            "Expected error message in stderr"
        );
        // And the exception’s stack trace
        assertTrue(
            err.contains("java.lang.RuntimeException: TLE fetch failed"),
            "Expected stack trace in stderr"
        );
    }

    @Test
    void clearAllTleRelatedData_deletesAllEntitiesInOrder() {
        // Act
        tleService.clearAllTleRelatedData();

        // Assert calls in order
        InOrder inOrder = inOrder(
            satelliteRepository,
            debrisRepository,
            rocketBodyRepository,
            tleRepository
        );
        inOrder.verify(satelliteRepository).deleteAllSatellites();
        inOrder.verify(debrisRepository).deleteAllDebris();
        inOrder.verify(rocketBodyRepository).deleteAllRocketBodies();
        inOrder.verify(tleRepository).deleteAllTleData();
    }
}
