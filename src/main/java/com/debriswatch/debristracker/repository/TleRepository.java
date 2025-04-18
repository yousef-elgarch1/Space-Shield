package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.TleData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface TleRepository extends JpaRepository<TleData, Long> {

    @Query("SELECT t FROM TleData t WHERE t.objectType = :object_type")
    List<TleData> findTleDataByObjectType(@Param("object_type") String object_type);
    
}

