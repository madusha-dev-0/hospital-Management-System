package com.smartcare.Controller;

import com.smartcare.Entity.PatientEntity;
import com.smartcare.Services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;


    // Get all patients
    @GetMapping
    public List<PatientEntity> getAllPatients() {
        return patientService.getAllPatients();
    }


    // Add patient - we will implement this later
    @PostMapping
    public PatientEntity addPatient(@RequestBody PatientEntity patient) {
        return patientService.addPatient(patient);
    }
}
