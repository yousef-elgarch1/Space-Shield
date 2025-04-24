package com.debriswatch.debristracker.scheduler;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.repository.TleRepository;
import com.debriswatch.debristracker.service.OrbitService;
import com.debriswatch.debristracker.service.TleService;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrbitFeedbackScheduler {

    private final OrbitService orbitService;
    private final TleRepository tleRepository;
    private final TleService tleservice;

    public OrbitFeedbackScheduler(OrbitService orbitService, TleRepository tleRepository, TleService tleservice) {
        this.orbitService = orbitService;
        this.tleRepository = tleRepository;
        this.tleservice=tleservice;
    }

    // Runs every 30 seconds
    public void fetchOrbitEveryMinute() {

try{
    tleservice.fetchAndProcessTleData();
    System.out.println("fetching data in the scheduler ");

}catch(Exception e){
    System.out.println("fetching data in the scheduler throws an arror : " + e);
}

        List<TleData> tleList = tleRepository.findLatestTlePerObjectName(); // Fetch most recent TLE
for(TleData tle :tleList){
        if (tle != null) {
            OrbitPoint orbit = orbitService.computeCurrentOrbitPoint(tle);

            if (orbit != null) {
                System.out.println("Current Orbit Point:"+tle.getObjectName()+tle.getObjectId());
                System.out.println("Lat: " + orbit.getLatitude() +
                                   ", Lon: " + orbit.getLongitude() +
                                   ", Alt: " + orbit.getAltitude() + " meters");
                                   if (orbit.getAltitude() > 100_000_000) {
                                    System.err.println(" \n \n Unrealistic altitude: " + orbit.getAltitude() + " for object " + tle.getObjectName());
                                    continue;
                                }
                                
            } else {
                System.err.println("Failed to compute current orbit point.");
            }
        } else {
            System.err.println("No TLE data found in the database.");
        }


    }
    }
}
