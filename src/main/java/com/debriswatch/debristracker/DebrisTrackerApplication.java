package com.debriswatch.debristracker;

import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DebrisTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DebrisTrackerApplication.class, args);
    }


}
