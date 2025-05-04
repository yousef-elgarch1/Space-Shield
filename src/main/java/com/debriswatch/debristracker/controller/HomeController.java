package com.debriswatch.debristracker.controller;

import java.util.Collections;
import java.util.List;

import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.service.OrbitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.DebrisRepository;
import com.debriswatch.debristracker.repository.RocketBodyRepository;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import com.debriswatch.debristracker.repository.TleRepository;
@RestController
@CrossOrigin(origins = "*") // adding the CrossOrigin annotation to allow requests from any origin- ELGARCH
                            // Youssef
@RequestMapping("/api/tle")
public class HomeController {
    @Autowired 
    private RocketBodyRepository rocketBodyRepository;
    @Autowired 
    private DebrisRepository debrisRepository;
    @Autowired 
    private SatelliteRepository satelliteRepository;
    @Autowired
    private TleRepository tleRepository;

    @GetMapping("/welcome")
    public String homePage() {
        return "🚀 Welcome to Debris Tracker API";
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<? extends TleData>> getTleByType(@RequestParam String type) {
        try {
            String normalized = type.trim().toUpperCase();

            switch (normalized) {
                case "ROCKET BODY":
                    return ResponseEntity.ok(rocketBodyRepository.findAll());
                case "DEBRIS":
                    return ResponseEntity.ok(debrisRepository.findAll());
                case "SATELLITE":
                    return ResponseEntity.ok(satelliteRepository.findAll());
                default:
                    return ResponseEntity.badRequest().body(Collections.emptyList());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<TleData> getLatestTle() {
        try {
            return ResponseEntity.ok(tleRepository.findTopByOrderByIdDataDesc());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/latest-per-object")
    public ResponseEntity<List<TleData>> getLatestTlePerObject() {
        try {
            return ResponseEntity.ok(tleRepository.findLatestTlePerObjectName());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        }
    }
}
