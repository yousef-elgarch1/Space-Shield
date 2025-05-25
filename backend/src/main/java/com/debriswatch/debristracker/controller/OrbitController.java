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

// 📊 ADD THESE IMPORTS FOR MONITORING
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.beans.factory.annotation.Autowired;


@RestController
// adding the CrossOrigin annotation to allow requests from any origin- ELGARCH
                            // Youssef
@RequestMapping("/api/orbit")
@CrossOrigin(origins = "*")
public class OrbitController {

    private final OrbitService orbitService;
    private final TleRepository tleRepository;
    private final TleService tleservice;

    // 📊 ADD MONITORING REGISTRY
    @Autowired
    private MeterRegistry meterRegistry;

    public OrbitController(OrbitService orbitService, TleRepository tleRepository,TleService tleservice) {
        this.orbitService = orbitService;
        this.tleRepository = tleRepository;
        this. tleservice= tleservice;
    }

    @GetMapping("/realtime")
    public List<OrbitResponseDto> getRealTimeOrbits() {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            // 🛰️ Track real-time orbit requests
            meterRegistry.counter("spaceshield.orbit.requests",
                    "type", "realtime",
                    "endpoint", "realtime").increment();

            // Track TLE data fetch and processing
            Timer.Sample fetchSample = Timer.start(meterRegistry);
            tleservice.fetchAndProcessTleData();
            fetchSample.stop(Timer.builder("spaceshield.tle.fetch.duration")
                    .description("Time spent fetching and processing TLE data")
                    .register(meterRegistry));

            List<TleData> tleList = tleRepository.findLatestTlePerObjectName();

            // Track orbital computations
            Timer.Sample computeSample = Timer.start(meterRegistry);
            List<OrbitResponseDto> result = tleList.stream()
                    .map(tle -> {
                        OrbitPoint point = orbitService.computeCurrentOrbitPoint(tle);
                        if (point != null) {
                            // Track successful orbital computation
                            meterRegistry.counter("spaceshield.orbit.computed",
                                    "object", tle.getObjectName(),
                                    "status", "success").increment();
                            return new OrbitResponseDto(
                                    tle.getObjectName(),
                                    point.getLatitude(),
                                    point.getLongitude(),
                                    point.getAltitude());
                        } else {
                            // Track failed orbital computation
                            meterRegistry.counter("spaceshield.orbit.computed",
                                    "object", tle.getObjectName(),
                                    "status", "failed").increment();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .toList();

            computeSample.stop(Timer.builder("spaceshield.orbit.computation.duration")
                    .description("Time spent computing current orbital positions")
                    .register(meterRegistry));

            // Track successful real-time orbit generation
            meterRegistry.counter("spaceshield.orbit.success",
                    "type", "realtime",
                    "objects_computed", String.valueOf(result.size())).increment();

            // Track current space objects being tracked in real-time
            meterRegistry.gauge("spaceshield.realtime.objects", result.size());

            return result;

        } catch (Exception e) {
            meterRegistry.counter("spaceshield.api.errors",
                    "endpoint", "realtime",
                    "error", e.getClass().getSimpleName()).increment();
            throw e;
        } finally {
            sample.stop(Timer.builder("spaceshield.orbit.realtime.total.duration")
                    .description("Total time for real-time orbit computation")
                    .register(meterRegistry));
        }
    }

    @GetMapping("/predict")
    public ResponseEntity<List<OrbitPoint>> predictOrbit(
            @RequestParam String objectName,
            @RequestParam(defaultValue = "1") int days) {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            // 🛰️ Track orbit prediction requests
            meterRegistry.counter("spaceshield.orbit.predictions",
                    "object", objectName,
                    "days", String.valueOf(days)).increment();

            // Validate input parameters
            if (days < 1 || days > 3) {
                meterRegistry.counter("spaceshield.api.errors",
                        "endpoint", "predict",
                        "error", "invalid_days_parameter",
                        "days", String.valueOf(days)).increment();
                return ResponseEntity.badRequest().body(Collections.emptyList());
            }

            // Fetch latest TLE for given object
            TleData tle = tleRepository.findTopByObjectNameOrderByEpochDesc(objectName);
            if (tle == null) {
                meterRegistry.counter("spaceshield.api.errors",
                        "endpoint", "predict",
                        "error", "object_not_found",
                        "object", objectName).increment();
                return ResponseEntity.notFound().build();
            }

            // Perform orbit prediction
            Timer.Sample predictionSample = Timer.start(meterRegistry);
            List<OrbitPoint> prediction = orbitService.predictOrbitForDays(tle, days);
            predictionSample.stop(Timer.builder("spaceshield.orbit.prediction.duration")
                    .description("Time spent predicting orbital trajectory")
                    .tag("days", String.valueOf(days))
                    .register(meterRegistry));

            // Track successful predictions
            meterRegistry.counter("spaceshield.orbit.prediction.success",
                    "object", objectName,
                    "days", String.valueOf(days),
                    "points", String.valueOf(prediction.size())).increment();

            return ResponseEntity.ok(prediction);

        } catch (Exception e) {
            meterRegistry.counter("spaceshield.api.errors",
                    "endpoint", "predict",
                    "error", e.getClass().getSimpleName(),
                    "object", objectName).increment();
            throw e;
        } finally {
            sample.stop(Timer.builder("spaceshield.orbit.predict.total.duration")
                    .description("Total time for orbit prediction request")
                    .register(meterRegistry));
        }
    }
}

