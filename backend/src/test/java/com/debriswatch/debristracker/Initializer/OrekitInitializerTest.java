package com.debriswatch.debristracker.Initializer;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.io.File;
import java.nio.file.Files;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {"orekit.data.path=${java.io.tmpdir}/orekit-test-data"})
class OrekitInitializerTest {

    @Autowired
    private OrekitInitializer orekitInitializer;

    private static File testDataDir;

    @BeforeAll
    static void setupDir() {
        // create a test directory to simulate Orekit data
        testDataDir = new File(System.getProperty("java.io.tmpdir"), "orekit-test-data");
        testDataDir.mkdirs();
    }

    @AfterAll
    static void cleanupDir() throws Exception {
        Files.deleteIfExists(testDataDir.toPath());
    }

    @Test
    void doesNotThrowWhenDirectoryExists() {
        // Should not throw an exception because directory exists
        assertDoesNotThrow(() -> orekitInitializer.init());
    }

    @Test
    void throwsWhenDirectoryMissing() {
        // Remove dir to simulate missing
        testDataDir.delete();
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> orekitInitializer.init());
        assertTrue(thrown.getMessage().contains("Orekit data directory not found"));
        // recreate dir for other tests
        testDataDir.mkdirs();
    }
}