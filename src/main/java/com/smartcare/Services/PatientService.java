package com.smartcare.Services;

import com.smartcare.Entity.PatientEntity;
import com.smartcare.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {


    @Autowired
    private PatientRepository patientRepository;


    public List<PatientEntity> getAllPatients() {
        return patientRepository.findAll();
    }


    public PatientEntity addPatient(PatientEntity patient) {
        return patientRepository.save(patient);
    }


}
