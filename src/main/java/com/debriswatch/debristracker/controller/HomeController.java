package com.debriswatch.debristracker.controller;

import java.util.Collections;
import java.util.List;

import com.debriswatch.debristracker.model.OrbitPoint;
import com.debriswatch.debristracker.service.OrbitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.debriswatch.debristracker.model.TleData;
import com.debriswatch.debristracker.repository.TleRepository;

@RestController
public class HomeController {

    @Autowired
    private TleRepository tleRepository1;

    @GetMapping("/")
    public String homePage() {
        return "Welcome to Debris Tracker API";
    }

    @GetMapping("/current")
    public List<TleData> getCurrentTleData() {
        try {


            return tleRepository1.findAll();
        } catch (Exception e) {
            e.printStackTrace(); // Ideally replace with logger
            return Collections.emptyList();
        }
    }

    @Autowired
    private OrbitService orbitService;

    @GetMapping("/{id}")
    public List<OrbitPoint> getOrbit(@PathVariable int id,
                                     @RequestParam(defaultValue = "180") int durationMinutes) {
        TleData tle = tleRepository1.findById((long) id)
                .orElseThrow(() -> new IllegalArgumentException("TLE not found for id: " + id));

        return orbitService.computeOrbitFromTle(tle, durationMinutes);
    }

}
