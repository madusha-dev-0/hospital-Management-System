package com.smartcare.Services;

import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Entity.DoctorEntity;
import com.smartcare.Entity.PatientEntity;
import com.smartcare.Entity.TreatmentEntity;
import com.smartcare.Repository.AppointmentRepository;
import com.smartcare.Repository.DoctorRepository;
import com.smartcare.Repository.PatientRepository;
import com.smartcare.Repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;



    public List<AppointmentEntity> getAllAppointment(){

        return appointmentRepository.findAll();
    }

    public void deleteAppointment(int appointmentId) {

        AppointmentEntity appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found"));
        if ("Completed".equalsIgnoreCase(
                appointment.getAppointmentStatus())) {

            throw new RuntimeException(
                    "Completed appointment cannot be deleted");
        }

        try {

            appointmentRepository.delete(appointment);

        } catch (org.springframework.dao.DataIntegrityViolationException e) {

            throw new RuntimeException(
                    "Appointment cannot be deleted because a treatment is linked to this appointment"
            );
        }
    }

    public AppointmentEntity updateAppointment(int id, AppointmentEntity newAppointment) {


        AppointmentEntity oldAppointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));


        if (!oldAppointment.getAppointmentStatus().equalsIgnoreCase("Scheduled")) {
            throw new RuntimeException("Only scheduled appointment can be updated");
        }


        PatientEntity patient = patientRepository.findById(
                newAppointment.getPatient().getPatient_ID()
        ).orElseThrow(() -> new RuntimeException("Patient not found"));


        DoctorEntity doctor = doctorRepository.findById(
                newAppointment.getDoctor().getDoctor_ID()
        ).orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean doctorAlreadyBooked =
                appointmentRepository.isDoctorAlreadyBooked(
                        doctor,
                        newAppointment.getAppointmentDate(),
                        newAppointment.getAppointmentTime(),
                        id
                );

        if (doctorAlreadyBooked) {
            throw new RuntimeException(
                    "Doctor already has an appointment at this date and time"
            );
        }

        // Update appointment
        oldAppointment.setPatient(patient);
        oldAppointment.setDoctor(doctor);
        oldAppointment.setAppointmentDate(
                newAppointment.getAppointmentDate()
        );
        oldAppointment.setAppointmentTime(
                newAppointment.getAppointmentTime()
        );
        oldAppointment.setAppointmentStatus(
                newAppointment.getAppointmentStatus()
        );
        oldAppointment.setConsultationRoom(
                newAppointment.getConsultationRoom()
        );

        return appointmentRepository.save(oldAppointment);
    }

    public AppointmentEntity addAppointment(AppointmentEntity appointment) {

        PatientEntity patient = patientRepository.findById(
                appointment.getPatient().getPatient_ID()
        ).orElseThrow(() ->
                new RuntimeException("Patient not found")
        );

        DoctorEntity doctor = doctorRepository.findById(
                appointment.getDoctor().getDoctor_ID()
        ).orElseThrow(() ->
                new RuntimeException("Doctor not found")
        );

        Date today = new Date(System.currentTimeMillis());

        if (appointment.getAppointmentDate().before(today)) {

            throw new RuntimeException(
                    "Appointment date cannot be in the past"
            );
        }

        boolean doctorAlreadyBooked =
                appointmentRepository.isDoctorAlreadyBooked(
                        doctor,
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                );

        if (doctorAlreadyBooked) {

            throw new RuntimeException(
                    "Doctor already has an appointment at this date and time"
            );
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        appointment.setAppointmentStatus("Scheduled");

        return appointmentRepository.save(appointment);
    }

    public AppointmentEntity getAppointmentById(int id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found"));
    }






}
