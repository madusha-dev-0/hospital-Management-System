package com.smartcare.Repository;

import com.smartcare.Entity.LaboratoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LaboratoryRepository extends JpaRepository<LaboratoryEntity,Integer> {

    @Query("SELECT l FROM LaboratoryEntity l WHERE l.patient.Patient_ID = :patientId")
    List<LaboratoryEntity> findLaboratoriesByPatientId(
            @Param("patientId") Integer patientId
    );


}
