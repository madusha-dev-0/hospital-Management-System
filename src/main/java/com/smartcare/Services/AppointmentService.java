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

    public AppointmentEntity getAppointmentById(Integer id){

        return appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id)) ;

    }

    public AppointmentEntity updateAppointment(
            Integer id,
            AppointmentEntity appointment) {

        AppointmentEntity existingAppointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found with ID: " + id));

        existingAppointment.setAppointmentDate(
                appointment.getAppointmentDate());

        existingAppointment.setAppointmentTime(
                appointment.getAppointmentTime());

        existingAppointment.setAppointmentStatus(
                appointment.getAppointmentStatus());

        existingAppointment.setPatient(
                appointment.getPatient());

//        existingAppointment.set(
//                appointment.getDoctor());

        return appointmentRepository.save(existingAppointment);
    }

    public void deleteAppointment(Integer id) {

        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException(
                    "Appointment not found with ID: " + id);
        }

        appointmentRepository.deleteById(id);
    }

    public List<AppointmentEntity> searchByPatientId(Integer patientId) {
        return appointmentRepository.findAppointmentsByPatientId(patientId);
    }





}
