package com.debriswatch.debristracker.Initializer;

import jakarta.annotation.PostConstruct;
import org.orekit.data.DataContext;
import org.orekit.data.DirectoryCrawler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class OrekitInitializer {

    @Value("${orekit.data.path}")
    private String orekitDataPath;

    @PostConstruct
    public void init() {
        File orekitData = new File(orekitDataPath);

        if (!orekitData.exists() || !orekitData.isDirectory()) {
            throw new RuntimeException("❌ Orekit data directory not found: " + orekitData.getAbsolutePath());
        }

        DataContext.getDefault()
                   .getDataProvidersManager()
                   .addProvider(new DirectoryCrawler(orekitData));

        System.out.println("✅ Orekit data loaded from: " + orekitData.getAbsolutePath());
    }
}
