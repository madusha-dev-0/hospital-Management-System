package com.smartcare.Controller;

import com.smartcare.Entity.PatientEntity;
import com.smartcare.Services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;
    
    @GetMapping
    public List<PatientEntity> getAllPatients() {
        return patientService.getAllPatients();
    }


    @PostMapping("/addpatient")
    public PatientEntity addPatient(@RequestBody PatientEntity patient) {

        return patientService.addPatient(patient);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable int id){

        String message = patientService.deletePatientByID(id);
        if (message.equals("Patient not found")) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(message);
        }

        if (message.startsWith("Patient cannot")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(message);
        }
        return ResponseEntity.ok(message);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePatient(
            @PathVariable int id,
            @RequestBody PatientEntity patient) {

        String message = patientService.updatePatient(id, patient);

        if (message.equals("Patient not found")) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(message);
        }

        return ResponseEntity.ok(message);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PatientEntity>> searchPatients(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String gender) {

        List<PatientEntity> patients =
                patientService.searchPatients(id, name, bloodGroup, gender);

        return ResponseEntity.ok(patients);
    }

}
