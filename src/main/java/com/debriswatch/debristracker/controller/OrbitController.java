package com.debriswatch.debristracker.controller;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.debriswatch.debristracker.dto.OrbitResponseDto;
import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.TleRepository;
import com.debriswatch.debristracker.service.OrbitService;
import com.debriswatch.debristracker.service.TleService;


@RestController
@RequestMapping("/api/orbit")
@CrossOrigin(origins = "*")
public class OrbitController {

    private final OrbitService orbitService;
    private final TleRepository tleRepository;
    private final TleService tleservice;

    public OrbitController(OrbitService orbitService, TleRepository tleRepository, TleService tleservice) {
        this.orbitService = orbitService;
        this.tleRepository = tleRepository;
        this.tleservice = tleservice;
    }

    @GetMapping("/realtime")
    public List<OrbitResponseDto> getRealTimeOrbits() {
        tleservice.clearAllTleRelatedData(); // drop all existing data from the databse for optimisation
        tleservice.fetchAndProcessTleData(); // fetch data and process it
        List<TleData> tleList = tleRepository.findLatestTlePerObjectName(); // find latest tle data per object
        return tleList.stream()
                .map(tle -> {
                    OrbitPoint point = orbitService.computeCurrentOrbitPoint(tle);
                    if (point != null) {
                        return new OrbitResponseDto(
                                tle.getObjectName(),
                                point.getLatitude(),
                                point.getLongitude(),
                                point.getAltitude());
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * Endpoint: /api/orbit/predict?objectName=EXPLORER%201&days=2
     */
    @GetMapping("/predict")
    public ResponseEntity<List<OrbitPoint>> predictOrbit(
            @RequestParam String objectName,
            @RequestParam(defaultValue = "1") int days) {
        // Cap the max days for performance
        if (days < 1 || days > 3) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        // Fetch latest TLE for given object
        TleData tle = tleRepository.findTopByObjectNameOrderByEpochDesc(objectName);
        if (tle == null) {
            return ResponseEntity.notFound().build();
        }

        List<OrbitPoint> prediction = orbitService.predictOrbitForDays(tle, days);
        return ResponseEntity.ok(prediction);
    }
}
