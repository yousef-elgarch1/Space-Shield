package com.debriswatch.debristracker.config;

import jakarta.annotation.PostConstruct;
import org.orekit.data.DataContext;
import org.orekit.data.DirectoryCrawler;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class OrekitInitializer {

    @PostConstruct
    public void init() {
        File orekitData = new File("src/main/resources/orekit-data");
        DataContext.getDefault()
                .getDataProvidersManager()
                .addProvider(new DirectoryCrawler(orekitData));
    }
}
