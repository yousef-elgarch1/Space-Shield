package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.TleData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TleRepository extends JpaRepository<TleData, Long> {
    // Add custom query methods here if needed
    List<TleData> findByObjectType(String objectType);
}
