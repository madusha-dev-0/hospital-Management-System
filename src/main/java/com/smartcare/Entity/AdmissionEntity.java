package com.smartcare.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private PatientEntity patient;

    @ManyToOne
    @JoinColumn(name ="Room_ID", referencedColumnName = "Room_ID")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private RoomEntity room;

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

    public Integer getPatientId() {
        return patient != null
                ? patient.getPatient_ID()
                : null;
    }

    public Integer getRoomId() {
        return room != null
                ? room.getRoomID()
                : null;
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

    public RoomEntity getRoom() {
        return room;
    }

    public void setRoom(RoomEntity room) {
        this.room = room;
    }
}
