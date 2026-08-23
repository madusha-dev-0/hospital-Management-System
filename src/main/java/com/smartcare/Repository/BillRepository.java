package com.smartcare.Repository;

import com.smartcare.Entity.BillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

public interface BillRepository extends JpaRepository<BillEntity,Integer> {
    @Query("SELECT b FROM BillEntity b WHERE b.patient.Patient_ID = :patientId")
    List<BillEntity> findBillsByPatientId(@Param("patientId") Integer patientId);

    @Query("""
    SELECT COALESCE(SUM(b.totalAmount), 0)
    FROM BillEntity b
    WHERE b.billDate = :today
    AND LOWER(b.paymentStatus) = 'paid'
""")
    BigDecimal getTodayRevenue(
            @Param("today") Date today
    );

}
