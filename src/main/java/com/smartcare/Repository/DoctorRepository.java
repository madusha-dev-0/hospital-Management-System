package com.smartcare.Repository;

import com.smartcare.Entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, Integer> {

    @Query("SELECT d FROM DoctorEntity d WHERE LOWER(d.Specialization) LIKE LOWER(CONCAT('%', :specialization, '%'))")
    List<DoctorEntity> findBySpecializationContainingIgnoreCase(@Param("specialization") String specialization);

    @Query("SELECT d FROM DoctorEntity d WHERE d.department.Department_ID = :departmentID")
    List<DoctorEntity> findByDepartmentId(@Param("departmentID") Integer departmentID);
}
