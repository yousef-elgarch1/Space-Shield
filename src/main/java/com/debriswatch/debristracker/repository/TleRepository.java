package com.debriswatch.debristracker.repository;

import com.debriswatch.debristracker.model.TleData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface TleRepository extends JpaRepository<TleData, Long> {

    @Query("SELECT t FROM TleData t WHERE t.objectType = :object_type")
    List<TleData> findTleDataByObjectType(@Param("object_type") String object_type);

    TleData findTopByOrderByIdDataDesc();   
    @Query(value = """
    SELECT * FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY object_name ORDER BY epoch DESC, id_data DESC) AS rn
        FROM tle_data
    ) AS ranked
    WHERE rn = 1
    ORDER BY epoch DESC
""", nativeQuery = true)
List<TleData> findLatestTlePerObjectName();



// empting the database ! it should be after deleting the rest of the tables due to the inheritance strategy
@Modifying
@Query(value = "DELETE FROM tle_data", nativeQuery = true)
void deleteAllTleData();

TleData findByNoradCatId(int noradId);

TleData findTopByObjectNameOrderByEpochDesc(String objectName);
}
