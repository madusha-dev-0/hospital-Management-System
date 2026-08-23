package com.smartcare.Repository;

import com.smartcare.Entity.TreatmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TreatmentRepository extends JpaRepository<TreatmentEntity,Integer> {
    @Query("SELECT t FROM TreatmentEntity t WHERE t.appointment.appointmentId = :appointmentId")
    List<TreatmentEntity> findTreatmentsByAppointmentId(
            @Param("appointmentId") Integer appointmentId
    );
}
