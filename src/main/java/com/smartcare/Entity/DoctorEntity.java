package com.smartcare.Entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Doctor")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY, getterVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.NONE)
public class DoctorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Doctor_ID")
    @JsonProperty("Doctor_ID")
    private Integer Doctor_ID;

    @Column(name = "Doctor_Name", nullable = false, length = 100)
    @JsonProperty("Doctor_Name")
    private String Doctor_Name;

    @Column(name = "Specialization", nullable = false, length = 100)
    @JsonProperty("Specialization")
    private String Specialization;

    @Column(name = "Qualification", length = 100)
    @JsonProperty("Qualification")
    private String Qualification;

    @Column(name = "Contact_Number", nullable = false, length = 15)
    @JsonProperty("Contact_Number")
    private String Contact_Number;

    @Column(name = "Consultation_Fee", nullable = false, precision = 10, scale = 2)
    @JsonProperty("Consultation_Fee")
    private BigDecimal Consultation_Fee;

    @ManyToOne
    @JoinColumn(name = "Department_ID", nullable = false)
    @JsonProperty("department")
    private DepartmentEntity department;

    public DoctorEntity() {}

    public DoctorEntity(Integer Doctor_ID, String Doctor_Name, String Specialization, String Qualification, String Contact_Number, BigDecimal Consultation_Fee, DepartmentEntity department) {
        this.Doctor_ID = Doctor_ID;
        this.Doctor_Name = Doctor_Name;
        this.Specialization = Specialization;
        this.Qualification = Qualification;
        this.Contact_Number = Contact_Number;
        this.Consultation_Fee = Consultation_Fee;
        this.department = department;
    }

    public Integer getDoctor_ID() {
        return Doctor_ID;
    }

    public void setDoctor_ID(Integer doctor_ID) {
        Doctor_ID = doctor_ID;
    }

    public String getDoctor_Name() {
        return Doctor_Name;
    }

    public void setDoctor_Name(String doctor_Name) {
        Doctor_Name = doctor_Name;
    }

    public String getSpecialization() {
        return Specialization;
    }

    public void setSpecialization(String specialization) {
        Specialization = specialization;
    }

    public String getQualification() {
        return Qualification;
    }

    public void setQualification(String qualification) {
        Qualification = qualification;
    }

    public String getContact_Number() {
        return Contact_Number;
    }

    public void setContact_Number(String contact_Number) {
        Contact_Number = contact_Number;
    }

    public BigDecimal getConsultation_Fee() {
        return Consultation_Fee;
    }

    public void setConsultation_Fee(BigDecimal consultation_Fee) {
        Consultation_Fee = consultation_Fee;
    }

    public DepartmentEntity getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentEntity department) {
        this.department = department;
    }
}
