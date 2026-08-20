package com.smartcare.Repository;

import com.smartcare.Entity.PatientEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Integer> {

    @Query("""
    SELECT p FROM PatientEntity p
    WHERE (:id IS NULL OR p.Patient_ID = :id)
    AND (:name IS NULL OR LOWER(p.Full_Name) LIKE LOWER(CONCAT('%', :name, '%')))
    AND (:bloodGroup IS NULL OR p.Blood_Group = :bloodGroup)
    AND (:gender IS NULL OR p.Gender = :gender)
""")
    List<PatientEntity> searchPatients(
            @Param("id") Integer id,
            @Param("name") String name,
            @Param("bloodGroup") String bloodGroup,
            @Param("gender") String gender
    );


}
