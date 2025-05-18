package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.RocketBody;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RocketBodyRepository extends JpaRepository<RocketBody, Long> {
    @Modifying
@Query(value = "DELETE FROM rocket_body", nativeQuery = true)
void deleteAllRocketBodies();
}
