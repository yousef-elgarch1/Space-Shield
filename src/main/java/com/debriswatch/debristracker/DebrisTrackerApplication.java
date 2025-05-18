package com.debriswatch.debristracker;


import io.github.cdimascio.dotenv.Dotenv;


import org.springframework.boot.SpringApplication; 
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;
                                                                                                                                                               
@EnableScheduling 

@SpringBootApplication
public class DebrisTrackerApplication {

    public static void main(String[] args) {
                // Load .env
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // Set system properties BEFORE Spring Boot starts
        System.setProperty("MYSQL_USERNAME", dotenv.get("MYSQL_USERNAME"));
        System.setProperty("MYSQL_PASSWORD", dotenv.get("MYSQL_PASSWORD"));
        SpringApplication.run(DebrisTrackerApplication.class, args);
    }


}
