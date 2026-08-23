package com.smartcare.Repository;

import com.smartcare.Entity.AppointmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface DashboardRepository
        extends JpaRepository<AppointmentEntity, Integer> {

    @Query("""
        SELECT a
        FROM AppointmentEntity a
        WHERE a.AppointmentDate = :today
        ORDER BY a.AppointmentTime
    """)
    List<AppointmentEntity> findTodayAppointments(
            @Param("today") Date today
    );
}