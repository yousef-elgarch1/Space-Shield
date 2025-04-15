package com.debriswatch.debristracker.service;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.TleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAccessor;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@SpringBootTest
class TleServiceTest {

    @InjectMocks
    @Spy
    private TleService tleService;

    @Mock
    private TleRepository tleRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
void testFetchAndProcessTleData_shouldSaveToDatabase() {
    try {
        // Mock result
        TleData tle = new TleData();
        tle.setObjectName("ISS (ZARYA)");
        tle.setEpoch(LocalDateTime.of(2024, 4, 10, 15, 0));
        List<TleData> fakeTleList = Collections.singletonList(tle);

        // Spy: mock parseTleJson
        doReturn(fakeTleList).when(tleService).parseTleJson(anyString());

        // Call method
        tleService.fetchAndProcessTleData();

        // Verify save
        verify(tleRepository, times(1)).saveAll(argThat(list ->
            ((List<TleData>) list).size() == 1 && "ISS (ZARYA)".equals(((List<TleData>) list).get(0).getObjectName())
        ));
    } catch (Exception e) {
        e.printStackTrace(); // ← Add this to catch silent failures
        assert false : "Test failed with exception: " + e.getMessage();
    }
}

}