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
import com.debriswatch.debristracker.repository.TleRepository;
@RestController
@RequestMapping("/api/tle")
public class HomeController {

    @Autowired
    private TleRepository tleRepository;

    @GetMapping("/welcome")
    public String homePage() {
        return "🚀 Welcome to Debris Tracker API";
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<TleData>> getTleByType(@RequestParam String type) {
        try {
            List<TleData> results = tleRepository.findTleDataByObjectType(type.toUpperCase());
            return ResponseEntity.ok(results);
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
