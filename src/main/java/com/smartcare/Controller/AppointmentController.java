package com.smartcare.Controller;


import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
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

}
