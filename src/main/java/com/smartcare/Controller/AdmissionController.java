package com.smartcare.Controller;

import com.smartcare.Entity.AdmissionEntity;
import com.smartcare.Services.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    @Autowired
    private AdmissionService admissionService;



    @PostMapping("/addadmission")
    public ResponseEntity<?> addAdmission(
            @RequestBody AdmissionEntity admission) {

        try {

            AdmissionEntity savedAdmission =
                    admissionService.addAdmission(admission);

            return new ResponseEntity<>(
                    savedAdmission,
                    HttpStatus.CREATED
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<?> getAllAdmissions() {

        try {

            List<AdmissionEntity> admissions =
                    admissionService.getAllAdmissions();

            return ResponseEntity.ok(admissions);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @PutMapping("/updateadmission/{id}")
    public ResponseEntity<?> updateAdmission(
            @PathVariable Integer id,
            @RequestBody AdmissionEntity admission) {

        try {

            AdmissionEntity updatedAdmission =
                    admissionService.updateAdmission(
                            id,
                            admission
                    );

            return ResponseEntity.ok(updatedAdmission);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @PutMapping("/dischargeadmission/{id}")
    public ResponseEntity<?> dischargePatient(
            @PathVariable Integer id) {

        try {

            AdmissionEntity admission =
                    admissionService.dischargePatient(id);

            return ResponseEntity.ok(admission);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @DeleteMapping("/deleteadmission/{id}")
    public ResponseEntity<?> deleteAdmission(
            @PathVariable Integer id) {

        try {

            admissionService.deleteAdmission(id);

            return ResponseEntity.ok(
                    "Admission deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}