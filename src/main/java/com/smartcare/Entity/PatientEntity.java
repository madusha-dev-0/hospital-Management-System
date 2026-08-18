package com.smartcare.Entity;

public class PatientEntity {
    private int patientId;
    private  String name;

    PatientEntity(){

    }
    PatientEntity(int patientId,String name){
        this.setPatientId(patientId);
        this.setName(name);
    }


    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
