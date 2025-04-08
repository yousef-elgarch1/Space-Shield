package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.Satellite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SatelliteRepository extends JpaRepository<Satellite, Long> {
}
