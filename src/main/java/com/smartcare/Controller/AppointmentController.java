package com.smartcare.Controller;


import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<AppointmentEntity> getAllAppointments(){
        return appointmentService.getAllAppointment();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable int id) {

        try {

            appointmentService.deleteAppointment(id);

            return ResponseEntity.ok(
                    "Appointment deleted successfully");

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateAppointment(
            @PathVariable int id,
            @RequestBody AppointmentEntity appointment) {

        try {

            appointmentService.updateAppointment(id, appointment);

            return ResponseEntity.ok("Appointment updated successfully");

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/addappointment")
    public ResponseEntity<String> addAppointment(
            @RequestBody AppointmentEntity appointment) {

        try {

            appointmentService.addAppointment(appointment);

            return ResponseEntity.ok(
                    "Appointment added successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable int id) {

        try {

            AppointmentEntity appointment =
                    appointmentService.getAppointmentById(id);

            return ResponseEntity.ok(appointment);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


}
