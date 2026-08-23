package com.smartcare.Services;

import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Repository.AppointmentRepository;
import com.smartcare.Repository.BillRepository;
import com.smartcare.Repository.PatientRepository;
import com.smartcare.Repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final RoomRepository roomRepository;
    private final BillRepository billRepository;

    public DashboardService(
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            RoomRepository roomRepository,
            BillRepository billRepository) {

        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.roomRepository = roomRepository;
        this.billRepository = billRepository;
    }



    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard =
                new HashMap<>();


        // ------------------------------
        // TODAY
        // ------------------------------

        Date today =
                new Date(System.currentTimeMillis());


        // ------------------------------
        // TOTAL PATIENTS
        // ------------------------------

        long totalPatients =
                patientRepository.count();


        // ------------------------------
        // TODAY APPOINTMENTS
        // ------------------------------

        List<AppointmentEntity> appointments =
                appointmentRepository
                        .findAppointmentsByDate(today);


        long todayAppointments =
                appointments.size();


        // ------------------------------
        // AVAILABLE BEDS
        // ------------------------------

        long availableBeds =
                roomRepository
                        .countByAvailabilityIgnoreCase(
                                "Available"
                        );


        // ------------------------------
        // TODAY REVENUE
        // ------------------------------

        BigDecimal todayRevenue =
                billRepository
                        .getTodayRevenue(today);


        if (todayRevenue == null) {
            todayRevenue = BigDecimal.ZERO;
        }


        // ------------------------------
        // PUT DATA
        // ------------------------------

        dashboard.put(
                "totalPatients",
                totalPatients
        );

        dashboard.put(
                "todayAppointments",
                todayAppointments
        );

        dashboard.put(
                "availableBeds",
                availableBeds
        );

        dashboard.put(
                "todayRevenue",
                todayRevenue
        );

        dashboard.put(
                "appointments",
                appointments
        );


        return dashboard;
    }
}