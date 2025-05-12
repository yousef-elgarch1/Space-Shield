package com.debriswatch.debristracker.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure()
                     .ignoreIfMissing()  // Optional: avoids errors if .env is absent
                     .load();
    }
}
