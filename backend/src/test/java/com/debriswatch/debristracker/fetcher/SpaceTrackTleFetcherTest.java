package com.debriswatch.debristracker.fetcher;

import com.debriswatch.debristracker.Factory.TleObjectFactory;
import com.debriswatch.debristracker.model.Debris;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.*;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;

import static org.mockito.Mockito.*;

class SpaceTrackTleFetcherTest {

    @Mock private SatelliteRepository satelliteRepo;
    @Mock private DebrisRepository debrisRepo;
    @Mock private RocketBodyRepository rocketRepo;
    @Mock private TleRepository tleRepo;
    @Mock private TleObjectFactory tleObjectFactory;
    @Mock private Dotenv dotenv;

    @InjectMocks private SpaceTrackTleFetcher fetcher;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        when(dotenv.get("SPACE_TRACK_USERNAME")).thenReturn("fake_user");
        when(dotenv.get("SPACE_TRACK_PASSWORD")).thenReturn("fake_pass");

        // Spy and override HTTP methods to avoid real requests
        fetcher = spy(new SpaceTrackTleFetcher(dotenv));

        fetcher.tleRepo = tleRepo;
        fetcher.debrisRepo = debrisRepo;
        fetcher.rocketRepo = rocketRepo;
        fetcher.satelliteRepo = satelliteRepo;
        fetcher.tleObjectFactory = tleObjectFactory;
    }

    @Test
    void testSaveTleData_savesDebris() {
        TleData tle = mock(TleData.class);
        when(tle.getObjectType()).thenReturn("DEBRIS");
        Debris mockDebris = new Debris();
        when(tleObjectFactory.create(tle)).thenReturn(mockDebris);

        fetcher.saveTleData(List.of(tle));

        verify(tleRepo).saveAll(any());
        verify(debrisRepo).save(mockDebris);
        verify(rocketRepo, never()).save(any());
        verify(satelliteRepo, never()).save(any());
    }

    @Test
    void testFetchAndProcess_usesOverriddenFlow() throws Exception {
        // Simulate flow by overriding methods
        doNothing().when(fetcher).authenticate();
        doReturn("[{\"OBJECT_TYPE\": \"DEBRIS\", \"OBJECT_NAME\": \"TEST\", \"NORAD_CAT_ID\": 12345}]")
                .when(fetcher).fetchRawData();

        TleData fakeParsed = new TleData();
        fakeParsed.setObjectType("DEBRIS");
        when(tleObjectFactory.create(any())).thenReturn(new Debris(fakeParsed));

        fetcher.fetchAndProcess();

        verify(tleRepo).saveAll(any());
        verify(debrisRepo).save(any());
    }
}
