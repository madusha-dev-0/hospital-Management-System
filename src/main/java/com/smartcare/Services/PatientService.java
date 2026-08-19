package com.smartcare.Services;

<<<<<<< HEAD
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


=======
import org.springframework.stereotype.Service;

@Service
public class PatientService {
>>>>>>> f754e7a7edf83b83edd09afea8dcebaaed467cb0
}
