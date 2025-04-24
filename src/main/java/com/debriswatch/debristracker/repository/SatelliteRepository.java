package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.Satellite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SatelliteRepository extends JpaRepository<Satellite, Long> {
    @Modifying
@Query(value = "DELETE FROM satellite", nativeQuery = true)
void deleteAllSatellites();
}
