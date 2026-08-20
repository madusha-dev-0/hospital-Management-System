package com.smartcare.Entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "appointment")
public class AppointmentEntity {

    @Id
    private int appointmentId;

    @ManyToOne
    @JoinColumn(name = "Patient_ID", referencedColumnName = "Patient_ID")
    private PatientEntity patient;

//    @ManyToOne
//    @JoinColumn(name = "DoctorID", referencedColumnName = "Doctor_ID")
//    private DoctorEntity doctor;

    private Date AppointmentDate;
    private Time AppointmentTime;
    private String AppointmentStatus;
    private String ConsultationRoom;

    public AppointmentEntity() {
    }


    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
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
}
