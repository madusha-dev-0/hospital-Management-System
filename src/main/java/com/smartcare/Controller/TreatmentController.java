package com.smartcare.Controller;

import com.smartcare.Entity.TreatmentEntity;
import com.smartcare.Services.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treatments")
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;



    @PostMapping("/addtreatment")
    public ResponseEntity<?> addTreatment(
            @RequestBody TreatmentEntity treatment) {

        try {

            TreatmentEntity savedTreatment =
                    treatmentService.addTreatment(treatment);

            return new ResponseEntity<>(
                    savedTreatment,
                    HttpStatus.CREATED
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<?> getAllTreatments() {

        try {

            List<TreatmentEntity> treatments =
                    treatmentService.getAllTreatments();

            return ResponseEntity.ok(treatments);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @PutMapping("/updatetreatment/{id}")
    public ResponseEntity<?> updateTreatment(
            @PathVariable Integer id,
            @RequestBody TreatmentEntity treatment) {

        try {

            TreatmentEntity updatedTreatment =
                    treatmentService.updateTreatment(
                            id,
                            treatment
                    );

            return ResponseEntity.ok(updatedTreatment);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @DeleteMapping("/deletetreatment/{id}")
    public ResponseEntity<?> deleteTreatment(
            @PathVariable Integer id) {

        try {

            treatmentService.deleteTreatment(id);

            return ResponseEntity.ok(
                    "Treatment deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}