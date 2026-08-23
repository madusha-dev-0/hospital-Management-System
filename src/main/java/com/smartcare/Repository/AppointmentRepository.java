package com.smartcare.Repository;

import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity,Integer> {

    @Query("SELECT a FROM AppointmentEntity a WHERE a.patient.Patient_ID = :patientId")
    List<AppointmentEntity> findAppointmentsByPatientId(@Param("patientId") Integer patientId);

    @Query("""
        SELECT COUNT(a) > 0
        FROM AppointmentEntity a
        WHERE a.doctor = :doctor
        AND a.AppointmentDate = :appointmentDate
        AND a.AppointmentTime = :appointmentTime
        AND a.appointmentId <> :appointmentId
    """)
    boolean isDoctorAlreadyBooked(
            @Param("doctor") DoctorEntity doctor,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime,
            @Param("appointmentId") Integer appointmentId
    );

    @Query("""
        SELECT COUNT(a) > 0
        FROM AppointmentEntity a
        WHERE a.doctor = :doctor
        AND a.AppointmentDate = :appointmentDate
        AND a.AppointmentTime = :appointmentTime
    """)
    boolean isDoctorAlreadyBooked(
            @Param("doctor") DoctorEntity doctor,
            @Param("appointmentDate") Date appointmentDate,
            @Param("appointmentTime") Time appointmentTime
    );

    @Query("""
           SELECT a
           FROM AppointmentEntity a
           WHERE a.AppointmentDate = :date
           ORDER BY a.AppointmentTime
           """)
    List<AppointmentEntity> findAppointmentsByDate(
            @Param("date") Date date
    );


}
