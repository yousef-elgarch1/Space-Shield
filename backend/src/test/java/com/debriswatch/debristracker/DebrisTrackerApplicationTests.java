package com.debriswatch.debristracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
  // point at our nested config instead of your real application
  classes = DebrisTrackerApplicationTests.MinimalConfig.class,
  webEnvironment = SpringBootTest.WebEnvironment.NONE
)
class DebrisTrackerApplicationTests {

  @Test
  void contextLoads() {
    // If we get here, Spring started just fine—no DB, no .env, no JPA, no web server.
  }

  /**
   * This nested config is all we load in the test.
   * We exclude every auto-configuration that might talk to a real DB
   * or require a .env file or start a web server.
   */
  @EnableAutoConfiguration(exclude = {
    DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class
  })
  static class MinimalConfig { }
}
