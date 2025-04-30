package com.debriswatch.debristracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.username=root",
    "spring.datasource.password=youssef1515",
    "spring.datasource.url=jdbc:mysql://localhost:3306/conge_system?useSSL=false&allowPublicKeyRetrieval=true"
})
class DebrisTrackerApplicationTests {

    @Test
    void contextLoads() {
    }
}
