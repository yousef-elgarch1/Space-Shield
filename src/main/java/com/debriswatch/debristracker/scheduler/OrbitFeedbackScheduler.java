package com.debriswatch.debristracker.scheduler;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.repository.TleRepository;
import com.debriswatch.debristracker.service.OrbitService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrbitFeedbackScheduler {

    private final OrbitService orbitService;
    private final TleRepository tleRepository;

    public OrbitFeedbackScheduler(OrbitService orbitService, TleRepository tleRepository) {
        this.orbitService = orbitService;
        this.tleRepository = tleRepository;
    }

    //  runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    public void fetchOrbitEveryMinute() {
        // Example: get the latest TLE from DB
        TleData tle = tleRepository.findTopByOrderByIdDataDesc(); // Adjust to your needs

        // Get orbit prediction for the next 60 minutes
        List<OrbitPoint> orbit = orbitService.computeOrbitFromTle(tle, 60);

        // You can log it, store it, or emit it via WebSocket
        System.out.println("Updated Orbit (" + orbit.size() + " points):");
        for (OrbitPoint point : orbit) {
            System.out.println("Lat: " + point.getLatitude() +
                               ", Lon: " + point.getLongitude() +
                               ", Alt: " + point.getAltitude());
        }
    }
}
