package com.smartcare.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "Billing")
public class BillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer billId;

    @ManyToOne
    @JoinColumn(name ="Patient_ID", referencedColumnName = "Patient_ID")
    @JsonIgnore
    private PatientEntity patient;

    private Date billDate;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String paymentMethod;

    public BillEntity(){}


    public Integer getBillId() {
        return billId;
    }

    public void setBillId(Integer billId) {
        this.billId = billId;
    }

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
    }

    public Integer getPatientId() {
        return patient != null ? patient.getPatient_ID() : null;
    }

    public Date getBillDate() {
        return billDate;
    }

    public void setBillDate(Date billDate) {
        this.billDate = billDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}