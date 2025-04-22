package com.debriswatch.debristracker.scheduler;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.repository.TleRepository;
import com.debriswatch.debristracker.service.OrbitService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrbitFeedbackScheduler {

    private final OrbitService orbitService;
    private final TleRepository tleRepository;

    public OrbitFeedbackScheduler(OrbitService orbitService, TleRepository tleRepository) {
        this.orbitService = orbitService;
        this.tleRepository = tleRepository;
    }

    // Runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void fetchOrbitEveryMinute() {


        TleData tle = tleRepository.findTopByOrderByIdDataDesc(); // Fetch most recent TLE

        if (tle != null) {
            OrbitPoint orbit = orbitService.computeCurrentOrbitPoint(tle);

            if (orbit != null) {
                System.out.println("Current Orbit Point:");
                System.out.println("Lat: " + orbit.getLatitude() +
                                   ", Lon: " + orbit.getLongitude() +
                                   ", Alt: " + orbit.getAltitude() + " meters");
            } else {
                System.err.println("Failed to compute current orbit point.");
            }
        } else {
            System.err.println("No TLE data found in the database.");
        }
    }
}
