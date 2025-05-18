package com.debriswatch.debristracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.debriswatch.debristracker.service.TleService;

@RestController
//adding the CrossOrigin annotation to allow requests from any origin- ELGARCH Youssef
@RequestMapping("/api/tle")
@CrossOrigin(origins = "*")
public class TleFetchController {

    @Autowired
    private TleService tleService;

    @GetMapping("/fetch")
    public String fetchNow() {
        tleService.fetchAndProcessTleData();
        return "✅ Fetched and stored TLE data.";
    }
}

