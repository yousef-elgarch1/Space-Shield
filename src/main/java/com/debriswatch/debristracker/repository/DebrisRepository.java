package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.Debris;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DebrisRepository extends JpaRepository<Debris, Long> {
    @Modifying
@Query(value = "DELETE FROM debris", nativeQuery = true)
void deleteAllDebris();
}
