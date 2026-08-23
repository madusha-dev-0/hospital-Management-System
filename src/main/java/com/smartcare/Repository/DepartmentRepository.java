package com.smartcare.Repository;

import com.smartcare.Entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity,Integer> {


    @Query("SELECT d FROM DepartmentEntity d WHERE LOWER(d.Department_Name) LIKE LOWER(CONCAT('%', :departmentName, '%'))")
    List<DepartmentEntity> findByDepartmentNameContainingIgnoreCase(@Param("departmentName") String departmentName);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM DepartmentEntity d WHERE d.Department_Name = :departmentName")
    boolean existsByDepartmentName(@Param("departmentName") String departmentName);

}
