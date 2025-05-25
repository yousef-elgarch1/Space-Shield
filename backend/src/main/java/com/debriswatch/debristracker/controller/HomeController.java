package com.debriswatch.debristracker.controller;

import java.util.Collections;
import java.util.List;

import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.service.OrbitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

// 📊 ADD THESE IMPORTS FOR MONITORING
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;


@RestController
// adding the CrossOrigin annotation to allow requests from any origin- ELGARCH
                            // Youssef
@RequestMapping("/api/tle")
@CrossOrigin(origins = "*")
public class HomeController {
    @Autowired 
    private RocketBodyRepository rocketBodyRepository;
    @Autowired 
    private DebrisRepository debrisRepository;
    @Autowired 
    private SatelliteRepository satelliteRepository;
    @Autowired
    private TleRepository tleRepository;

    // 📊 ADD MONITORING REGISTRY
    @Autowired
    private MeterRegistry meterRegistry;

    @GetMapping("/welcome")
    public String homePage() {
        // 🛰️ Track SpaceShield welcome requests
        meterRegistry.counter("spaceshield.api.requests",
                "endpoint", "welcome",
                "service", "debris-tracker").increment();
        return "🚀 Welcome to Debris Tracker API";
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<? extends TleData>> getTleByType(@RequestParam String type) {
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            String normalized = type.trim().toUpperCase();

            // 🛰️ Track requests by space object type
            meterRegistry.counter("spaceshield.data.requests",
                    "type", normalized.toLowerCase(),
                    "endpoint", "by-type").increment();

            List<? extends TleData> result;

            switch (normalized) {
                case "ROCKET BODY":
                    result = rocketBodyRepository.findAll();
                    meterRegistry.counter("spaceshield.rocket_bodies.retrieved",
                            "count", String.valueOf(result.size())).increment();
                    break;
                case "DEBRIS":
                    result = debrisRepository.findAll();
                    meterRegistry.counter("spaceshield.debris.retrieved",
                            "count", String.valueOf(result.size())).increment();
                    break;
                case "SATELLITE":
                    result = satelliteRepository.findAll();
                    meterRegistry.counter("spaceshield.satellites.retrieved",
                            "count", String.valueOf(result.size())).increment();
                    break;
                default:
                    // Track invalid requests
                    meterRegistry.counter("spaceshield.api.errors",
                            "endpoint", "by-type",
                            "error", "invalid_type",
                            "requested_type", type).increment();
                    return ResponseEntity.badRequest().body(Collections.emptyList());
            }

            // Track successful data retrieval
            meterRegistry.counter("spaceshield.data.success",
                    "type", normalized.toLowerCase()).increment();

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            // 🚨 Track errors in space data retrieval
            meterRegistry.counter("spaceshield.api.errors",
                    "endpoint", "by-type",
                    "error", e.getClass().getSimpleName()).increment();
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        } finally {
            // ⏱️ Track query execution time
            sample.stop(Timer.builder("spaceshield.data.query.duration")
                    .description("Time spent querying space object data")
                    .tag("endpoint", "by-type")
                    .register(meterRegistry));
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<TleData> getLatestTle() {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            // 🛰️ Track latest TLE requests
            meterRegistry.counter("spaceshield.tle.requests",
                    "type", "latest",
                    "endpoint", "latest").increment();

            TleData result = tleRepository.findTopByOrderByIdDataDesc();

            if (result != null) {
                meterRegistry.counter("spaceshield.tle.success",
                        "type", "latest").increment();
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            meterRegistry.counter("spaceshield.api.errors",
                    "endpoint", "latest",
                    "error", e.getClass().getSimpleName()).increment();
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } finally {
            sample.stop(Timer.builder("spaceshield.tle.query.duration")
                    .description("Time spent retrieving latest TLE data")
                    .register(meterRegistry));
        }
    }

    @GetMapping("/latest-per-object")
    public ResponseEntity<List<TleData>> getLatestTlePerObject() {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            // 🛰️ Track latest per object requests
            meterRegistry.counter("spaceshield.tle.requests",
                    "type", "latest_per_object",
                    "endpoint", "latest-per-object").increment();

            List<TleData> result = tleRepository.findLatestTlePerObjectName();

            // Track number of space objects being tracked
            meterRegistry.gauge("spaceshield.objects.tracked", result.size());
            meterRegistry.counter("spaceshield.tle.success",
                    "type", "latest_per_object",
                    "count", String.valueOf(result.size())).increment();

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            meterRegistry.counter("spaceshield.api.errors",
                    "endpoint", "latest-per-object",
                    "error", e.getClass().getSimpleName()).increment();
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Collections.emptyList());
        } finally {
            sample.stop(Timer.builder("spaceshield.tle.batch.duration")
                    .description("Time spent retrieving latest TLE data per object")
                    .register(meterRegistry));
        }
    }
}
