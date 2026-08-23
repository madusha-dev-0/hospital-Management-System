package com.smartcare.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "appointment")
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Appointment_ID")
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "Patient_ID", referencedColumnName = "Patient_ID")
    @JsonIgnore
    private PatientEntity patient;

    @ManyToOne
    @JoinColumn(name = "Doctor_ID", referencedColumnName = "Doctor_ID")
    @JsonIgnore
    private DoctorEntity doctor;

    private Date AppointmentDate;
    private Time AppointmentTime;

    @Column(name = "Appointment_Status")
    private String AppointmentStatus;
    private String ConsultationRoom;

    public AppointmentEntity() {
    }


    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
    }

    public Integer getPatientId() {
        return patient != null ? patient.getPatient_ID() : null;
    }

    public Integer getDoctorId() {
        return doctor != null ? doctor.getDoctor_ID() : null;
    }

    public Date getAppointmentDate() {
        return AppointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        AppointmentDate = appointmentDate;
    }

    public Time getAppointmentTime() {
        return AppointmentTime;
    }

    public void setAppointmentTime(Time appointmentTime) {
        AppointmentTime = appointmentTime;
    }

    public String getAppointmentStatus() {
        return AppointmentStatus;
    }

    public void setAppointmentStatus(String appointmentStatus) {
        AppointmentStatus = appointmentStatus;
    }

    public String getConsultationRoom() {
        return ConsultationRoom;
    }

    public void setConsultationRoom(String consultationRoom) {
        ConsultationRoom = consultationRoom;
    }

    public DoctorEntity getDoctor() {
        return doctor;
    }

    public void setDoctor(DoctorEntity doctor) {
        this.doctor = doctor;
    }
}