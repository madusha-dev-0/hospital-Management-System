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

    @PostMapping("/addappointment")
    public AppointmentEntity addAppointment(@RequestBody AppointmentEntity appointment){

        return appointmentService.addAppointment(appointment);

    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentEntity> getAppointmentById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                appointmentService.getAppointmentById(id)
        );
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AppointmentEntity> updateAppointment(
            @PathVariable Integer id,
            @RequestBody AppointmentEntity appointment) {

        return ResponseEntity.ok(
                appointmentService.updateAppointment(id, appointment)
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable Integer id) {

        appointmentService.deleteAppointment(id);

        return ResponseEntity.ok(
                "Appointment deleted successfully"
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<AppointmentEntity>> searchByPatientId(
            @RequestParam Integer patientId) {

        return ResponseEntity.ok(
                appointmentService.searchByPatientId(patientId)
        );
    }



}
