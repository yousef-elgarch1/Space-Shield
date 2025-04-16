package com.debriswatch.debristracker.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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
}
