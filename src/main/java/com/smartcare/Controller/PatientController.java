package com.smartcare.Controller;

import com.smartcare.Entity.PatientEntity;
import com.smartcare.Services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping("/addpatient")
    public PatientEntity addPatient(@RequestBody PatientEntity patient) {

        return patientService.addPatient(patient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable int id){
        patientService.deletePatientByID(id);
    }

}
