package com.smartcare.Services;

import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<AppointmentEntity> getAllAppointment(){
        return appointmentRepository.findAll();
    }

    public AppointmentEntity addAppointment(AppointmentEntity appointment){

        return appointmentRepository.save(appointment);
    }




}
