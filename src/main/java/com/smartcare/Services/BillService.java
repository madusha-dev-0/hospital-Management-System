package com.smartcare.Services;

import com.smartcare.Entity.BillEntity;
import com.smartcare.Entity.PatientEntity;
import com.smartcare.Repository.BillRepository;
import com.smartcare.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;
    @Autowired
    private PatientRepository patientRepository;

    public BillEntity generateBill(Integer patientId,
                                   java.math.BigDecimal totalAmount) {


        PatientEntity patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));


        if (totalAmount == null ||
                totalAmount.compareTo(java.math.BigDecimal.ZERO) < 0) {

            throw new RuntimeException("Total amount cannot be negative");
        }


        BillEntity bill = new BillEntity();

        bill.setPatient(patient);
        bill.setBillDate(new Date(System.currentTimeMillis()));
        bill.setTotalAmount(totalAmount);


        bill.setPaymentStatus("UNPAID");


        bill.setPaymentMethod(null);

        return billRepository.save(bill);
    }

    public List<BillEntity> getAllBills() {

        return billRepository.findAll();
    }

    public BillEntity getBillById(Integer billId) {

        return billRepository.findById(billId)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found"));
    }

    public BillEntity makePayment(Integer billId,
                                  String paymentMethod) {

        BillEntity bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found"));

        if ("PAID".equalsIgnoreCase(bill.getPaymentStatus())) {

            throw new RuntimeException(
                    "Bill is already paid");
        }


        if (paymentMethod == null ||
                paymentMethod.trim().isEmpty()) {

            throw new RuntimeException(
                    "Payment method is required");
        }

        bill.setPaymentStatus("PAID");
        bill.setPaymentMethod(paymentMethod);

        return billRepository.save(bill);
    }

    public List<BillEntity> getBillsByPatient(Integer patientId) {

        if (!patientRepository.existsById(patientId)) {

            throw new RuntimeException(
                    "Patient not found");
        }

        return billRepository.findBillsByPatientId(patientId);
    }

}
