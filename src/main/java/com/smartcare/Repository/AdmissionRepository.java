package com.smartcare.Repository;

import com.smartcare.Entity.AdmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdmissionRepository extends JpaRepository<AdmissionEntity, Integer> {

    @Query("SELECT a FROM AdmissionEntity a WHERE a.patient.Patient_ID = :patientId")
    List<AdmissionEntity> findAdmissionsByPatientId(
            @Param("patientId") Integer patientId
    );

    boolean existsByRoom_RoomId(Integer roomId);

    @Query("SELECT COUNT(a) > 0 FROM AdmissionEntity a WHERE a.patient.Patient_ID = :patientId")
    boolean existsByPatientId(@Param("patientId") Integer patientId);
}