package com.debriswatch.debristracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.debriswatch.debristracker.service.TleService;
// 📊 ADD THESE IMPORTS FOR MONITORING
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

@RestController
//adding the CrossOrigin annotation to allow requests from any origin- ELGARCH Youssef
@RequestMapping("/api/tle")
@CrossOrigin(origins = "*")
public class TleFetchController {

    @Autowired
    private TleService tleService;

    // 📊 ADD MONITORING REGISTRY
    @Autowired
    private MeterRegistry meterRegistry;

    @GetMapping("/fetch")
    public String fetchNow() {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            // 🛰️ Track TLE fetch requests
            meterRegistry.counter("spaceshield.tle.fetch.requests",
                    "endpoint", "fetch",
                    "trigger", "manual").increment();

            // Perform TLE fetch and processing
            tleService.fetchAndProcessTleData();

            // Track successful TLE fetch operations
            meterRegistry.counter("spaceshield.tle.fetch.success",
                    "trigger", "manual").increment();

            return "✅ SpaceShield: TLE data fetched and processed successfully. Space object database updated.";

        } catch (Exception e) {
            // Track TLE fetch errors
            meterRegistry.counter("spaceshield.api.errors",
                    "endpoint", "fetch",
                    "error", e.getClass().getSimpleName(),
                    "operation", "tle_fetch").increment();

            throw e;
        } finally {
            sample.stop(Timer.builder("spaceshield.tle.fetch.operation.duration")
                    .description("Time spent fetching and processing TLE data")
                    .register(meterRegistry));
        }
    }
}
