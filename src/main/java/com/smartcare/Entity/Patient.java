package com.smartcare.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Patient")
public class Patient {

    @Id
    private int Patient_ID;
    private String Full_Name;
    private String Blood_Group;
    private String DOB;
    private String Gender;
    private String Address;
    private String Contact_Number;
    private String Emergency_Contact_Infromation;

    public Patient(){

    }
    public Patient(int Patient_ID,String Full_Name,String Blood_Group,String DOB,String Gender,String Address,String Contact_Number,String Emergency_Contact_Infromation){
        this.setPatient_ID(Patient_ID);
        this.setFull_Name(Full_Name);
        this.setBlood_Group(Blood_Group);
        this.setDOB(DOB);
        this.setGender(Gender);
        this.setAddress(Address);
        this.setContact_Number(Contact_Number);
        this.setEmergency_Contact_Infromation(Emergency_Contact_Infromation);
    }


    public int getPatient_ID() {
        return Patient_ID;
    }

    public void setPatient_ID(int patient_ID) {
        Patient_ID = patient_ID;
    }

    public String getFull_Name() {
        return Full_Name;
    }

    public void setFull_Name(String full_Name) {
        Full_Name = full_Name;
    }

    public String getBlood_Group() {
        return Blood_Group;
    }

    public void setBlood_Group(String blood_Group) {
        Blood_Group = blood_Group;
    }

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

    public String getGender() {
        return Gender;
    }

    public void setGender(String gender) {
        Gender = gender;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public String getContact_Number() {
        return Contact_Number;
    }

    public void setContact_Number(String contact_Number) {
        Contact_Number = contact_Number;
    }

    public String getEmergency_Contact_Infromation() {
        return Emergency_Contact_Infromation;
    }

    public void setEmergency_Contact_Infromation(String emergency_Contact_Infromation) {
        Emergency_Contact_Infromation = emergency_Contact_Infromation;
    }
}
