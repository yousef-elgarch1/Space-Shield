package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.Debris;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DebrisRepository extends JpaRepository<Debris, Long> {
}
