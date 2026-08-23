package com.smartcare.Controller;

import com.smartcare.Entity.LaboratoryEntity;
import com.smartcare.Services.LaboratoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratory")
public class LaboratoryController {

    @Autowired
    private LaboratoryService laboratoryService;


    @PostMapping("/addlaboratory")
    public ResponseEntity<?> addTest(
            @RequestBody LaboratoryEntity test) {

        try {

            LaboratoryEntity savedTest =
                    laboratoryService.addTest(test);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new Object() {
                        public final String message =
                                "Laboratory test added successfully";
                        public final LaboratoryEntity laboratory =
                                savedTest;
                    });

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<?> getAllTests() {

        try {

            List<LaboratoryEntity> tests =
                    laboratoryService.getAllTests();

            return ResponseEntity.ok(tests);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    @PutMapping("/updatelaboratory/{id}")
    public ResponseEntity<?> updateTest(
            @PathVariable Integer id,
            @RequestBody LaboratoryEntity test) {

        try {

            LaboratoryEntity updatedTest =
                    laboratoryService.updateTest(id, test);

            return ResponseEntity.ok(updatedTest);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @DeleteMapping("/deletelaboratory/{id}")
    public ResponseEntity<?> deleteTest(
            @PathVariable Integer id) {

        try {

            laboratoryService.deleteTest(id);

            return ResponseEntity.ok(
                    "Laboratory test deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/searchlabototory")
    public ResponseEntity<?> searchLaboratories(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) java.sql.Date testDate,
            @RequestParam(required = false) String testStatus) {

        try {

            List<LaboratoryEntity> laboratories =
                    laboratoryService.searchLaboratories(
                            id,
                            testDate,
                            testStatus
                    );

            if (laboratories.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("No laboratory tests found");
            }

            return ResponseEntity.ok(laboratories);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}