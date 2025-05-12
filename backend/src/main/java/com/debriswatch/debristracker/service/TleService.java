package com.debriswatch.debristracker.service;

import com.debriswatch.debristracker.fetcher.SpaceTrackTleFetcher;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class TleService {

    private final SpaceTrackTleFetcher tleFetcher;
    private final SatelliteRepository satelliteRepository;
    private final DebrisRepository debrisRepository;
    private final RocketBodyRepository rocketBodyRepository;
    private final TleRepository tleRepository;

    @Autowired
    public TleService(
            SpaceTrackTleFetcher tleFetcher,
            SatelliteRepository satelliteRepository,
            DebrisRepository debrisRepository,
            RocketBodyRepository rocketBodyRepository,
            TleRepository tleRepository
    ) {
        this.tleFetcher = tleFetcher;
        this.satelliteRepository = satelliteRepository;
        this.debrisRepository = debrisRepository;
        this.rocketBodyRepository = rocketBodyRepository;
        this.tleRepository = tleRepository;
    }

    public void fetchAndProcessTleData() {
        try {
            tleFetcher.fetchAndProcess();
        } catch (Exception e) {
            System.err.println("Failed to fetch TLE data: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public void clearAllTleRelatedData() {
        satelliteRepository.deleteAllSatellites();
        debrisRepository.deleteAllDebris();
        rocketBodyRepository.deleteAllRocketBodies();
        tleRepository.deleteAllTleData();
    }
}
