package com.smartcare.Controller;

import com.smartcare.Entity.BillEntity;

import com.smartcare.Services.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;


    @PostMapping("/generatebill")
    public ResponseEntity<BillEntity> generateBill(
            @RequestParam Integer patientId,
            @RequestParam BigDecimal totalAmount) {

        BillEntity bill =
                billService.generateBill(
                        patientId,
                        totalAmount);

        return ResponseEntity.ok(bill);
    }

    @GetMapping
    public ResponseEntity<List<BillEntity>> getAllBills() {

        return ResponseEntity.ok(
                billService.getAllBills());
    }


    @GetMapping("/{billId}")
    public ResponseEntity<BillEntity> getBillById(
            @PathVariable Integer billId) {

        return ResponseEntity.ok(
                billService.getBillById(billId));
    }


    @PutMapping("/{billId}/payment")
    public ResponseEntity<?> makePayment(
            @PathVariable Integer billId,
            @RequestParam String paymentMethod) {

        try {
            BillEntity bill = billService.makePayment(
                    billId,
                    paymentMethod
            );

            return ResponseEntity.ok(bill);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getBillsByPatient(
            @PathVariable Integer patientId) {

        try {

            List<BillEntity> bills =
                    billService.getBillsByPatient(patientId);

            return ResponseEntity.ok(bills);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}