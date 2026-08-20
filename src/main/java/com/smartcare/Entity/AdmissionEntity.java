package com.smartcare.Entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "Admission")
public class AdmissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer admissionId;

    @ManyToOne
    @JoinColumn(name = "Patient_ID", referencedColumnName = "Patient_ID")
    private PatientEntity patient;

//    @ManyToOne
//    @JoinColumn(name ="RoomId", referencedColumnName = "Room_ID")
//    private RoomEntity room;

    private Date admissionDate;
    private Date DischargeDate;
    private String bedNumber;
    private String admissionStatus;

    public AdmissionEntity(){}


    public Integer getAdmissionId() {
        return admissionId;
    }

    public void setAdmissionId(Integer admissionId) {
        this.admissionId = admissionId;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
    }

    public Date getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(Date admissionDate) {
        this.admissionDate = admissionDate;
    }

    public Date getDischargeDate() {
        return DischargeDate;
    }

    public void setDischargeDate(Date dischargeDate) {
        DischargeDate = dischargeDate;
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }

    public String getAdmissionStatus() {
        return admissionStatus;
    }

    public void setAdmissionStatus(String admissionStatus) {
        this.admissionStatus = admissionStatus;
    }
}
