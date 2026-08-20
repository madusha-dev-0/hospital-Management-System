package com.smartcare.Entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "Laboratory")
public class LaboratoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer labTestId;

    @ManyToOne
    @JoinColumn(name = "Patient_ID", referencedColumnName = "Patient_ID")
    private PatientEntity patient;

//    @ManyToOne

    private String testName;
    private Date testDate;
    private String testResult;
    private String technicianName;
    private String testStatus;

    public LaboratoryEntity(){

    }


    public Integer getLabTestId() {
        return labTestId;
    }

    public void setLabTestId(Integer labTestId) {
        this.labTestId = labTestId;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
    }

    ////    @JoinColumn(name = "DoctorID", referencedColumnName = "Doctor_ID")
    ////    private DoctorEntity doctor;
    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public Date getTestDate() {
        return testDate;
    }

    public void setTestDate(Date testDate) {
        this.testDate = testDate;
    }

    public String getTestResult() {
        return testResult;
    }

    public void setTestResult(String testResult) {
        this.testResult = testResult;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public void setTechnicianName(String technicianName) {
        this.technicianName = technicianName;
    }

    public String getTestStatus() {
        return testStatus;
    }

    public void setTestStatus(String testStatus) {
        this.testStatus = testStatus;
    }
}
