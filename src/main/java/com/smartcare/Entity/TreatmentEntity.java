package com.smartcare.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "treatment")
public class TreatmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Treatment_ID")
    private Integer treatmentId;

    @ManyToOne
    @JoinColumn(name = "Appointment_ID", referencedColumnName = "Appointment_ID")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private AppointmentEntity appointment;

    @Column(name = "Diagnosis", nullable = false)
    private String diagnosis;

    @Column(name = "Prescription_Details")
    private String prescriptionDetails;

    @Column(name = "Treatment_Notes")
    private String treatmentNotes;

    @Column(name = "Treatment_Date", nullable = false)
    private Date treatmentDate;



    public TreatmentEntity() {
    }


    public TreatmentEntity(Integer treatmentId,
                           AppointmentEntity appointment,
                           String diagnosis,
                           String prescriptionDetails,
                           String treatmentNotes,
                           Date treatmentDate) {

        this.treatmentId = treatmentId;
        this.appointment = appointment;
        this.diagnosis = diagnosis;
        this.prescriptionDetails = prescriptionDetails;
        this.treatmentNotes = treatmentNotes;
        this.treatmentDate = treatmentDate;
    }




    public Integer getTreatmentId() {
        return treatmentId;
    }

    public void setTreatmentId(Integer treatmentId) {
        this.treatmentId = treatmentId;
    }

    public AppointmentEntity getAppointment() {
        return appointment;
    }

    public void setAppointment(AppointmentEntity appointment) {
        this.appointment = appointment;
    }

    public Integer getAppointmentId() {
        return appointment != null
                ? appointment.getAppointmentId()
                : null;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getPrescriptionDetails() {
        return prescriptionDetails;
    }

    public void setPrescriptionDetails(String prescriptionDetails) {
        this.prescriptionDetails = prescriptionDetails;
    }

    public String getTreatmentNotes() {
        return treatmentNotes;
    }

    public void setTreatmentNotes(String treatmentNotes) {
        this.treatmentNotes = treatmentNotes;
    }

    public Date getTreatmentDate() {
        return treatmentDate;
    }

    public void setTreatmentDate(Date treatmentDate) {
        this.treatmentDate = treatmentDate;
    }
}