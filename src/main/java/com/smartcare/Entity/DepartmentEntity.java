package com.smartcare.Entity;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Department")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY, getterVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.NONE)
public class DepartmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Department_ID")
    @JsonProperty("Department_ID")
    private Integer Department_ID;

    @Column(name = "Department_Name", nullable = false, unique = true, length = 100)
    @JsonProperty("Department_Name")
    private String Department_Name;

    @Column(name = "Location", nullable = false, length = 100)
    @JsonProperty("Location")
    private String Location;

    @OneToMany(mappedBy = "department")
    private List<DoctorEntity> doctor;


    public DepartmentEntity() {}

    public Integer getDepartment_ID() {
        return Department_ID;
    }

    public void setDepartment_ID(Integer department_ID) {
        Department_ID = department_ID;
    }

    public String getDepartment_Name() {
        return Department_Name;
    }

    public void setDepartment_Name(String department_Name) {
        Department_Name = department_Name;
    }

    public String getLocation() {
        return Location;
    }

    public void setLocation(String location) {
        Location = location;
    }

    public List<DoctorEntity> getDoctor() {
        return doctor;
    }

    public void setDoctor(List<DoctorEntity> doctor) {
        this.doctor = doctor;
    }
}
