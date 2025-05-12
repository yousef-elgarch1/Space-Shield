package com.debriswatch.debristracker;

import com.debriswatch.debristracker.model.Satellite;
import com.debriswatch.debristracker.repository.SatelliteRepository;
import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication; 
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling 

@SpringBootApplication
public class DebrisTrackerApplication {

public static void main(String[] args) {
    // Load .env
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    String mysqlUser = dotenv.get("MYSQL_USERNAME");
    String mysqlPass = dotenv.get("MYSQL_PASSWORD");

    if (mysqlUser != null && mysqlPass != null) {
        System.setProperty("MYSQL_USERNAME", mysqlUser);
        System.setProperty("MYSQL_PASSWORD", mysqlPass);
    } else {
        System.err.println("[ERROR] Missing MYSQL_USERNAME or MYSQL_PASSWORD in .env file.");
        System.exit(1); // Stop the app from continuing with broken config
    }

    SpringApplication.run(DebrisTrackerApplication.class, args);
}
}
