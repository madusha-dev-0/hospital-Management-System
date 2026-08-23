package com.smartcare.Repository;

import com.smartcare.Entity.LaboratoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface LaboratoryRepository extends JpaRepository<LaboratoryEntity,Integer> {

    @Query("SELECT l FROM LaboratoryEntity l WHERE l.patient.Patient_ID = :patientId")
    List<LaboratoryEntity> findLaboratoriesByPatientId(
            @Param("patientId") Integer patientId
    );

    @Query("""
    SELECT l FROM LaboratoryEntity l
    WHERE (:id IS NULL OR l.labTestId = :id)
    AND (:testDate IS NULL OR l.testDate = :testDate)
    AND (:testStatus IS NULL OR LOWER(l.testStatus) = LOWER(:testStatus))
""")
    List<LaboratoryEntity> searchLaboratories(
            @Param("id") Integer id,
            @Param("testDate") Date testDate,
            @Param("testStatus") String testStatus
    );


}
