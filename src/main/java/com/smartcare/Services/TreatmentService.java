package com.smartcare.Services;

import com.smartcare.Entity.AppointmentEntity;
import com.smartcare.Entity.TreatmentEntity;
import com.smartcare.Repository.AppointmentRepository;
import com.smartcare.Repository.TreatmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepository treatmentRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;


    public TreatmentEntity addTreatment(TreatmentEntity treatment) {


        if (treatment.getDiagnosis() == null ||
                treatment.getDiagnosis().trim().isEmpty()) {

            throw new RuntimeException("Diagnosis is required");
        }


        if (treatment.getTreatmentDate() == null) {

            throw new RuntimeException("Treatment date is required");
        }


        if (treatment.getAppointment() == null ||
                treatment.getAppointment().getAppointmentId() == 0) {

            throw new RuntimeException("Appointment ID is required");
        }


        AppointmentEntity appointment =
                appointmentRepository.findById(
                        treatment.getAppointment().getAppointmentId()
                ).orElseThrow(() ->
                        new RuntimeException("Appointment not found"));


        treatment.setAppointment(appointment);

        return treatmentRepository.save(treatment);
    }



    public List<TreatmentEntity> getAllTreatments() {

        return treatmentRepository.findAll();
    }



    public TreatmentEntity updateTreatment(
            Integer id,
            TreatmentEntity updatedTreatment) {


        TreatmentEntity existingTreatment =
                treatmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Treatment not found"));



        if (updatedTreatment.getDiagnosis() == null ||
                updatedTreatment.getDiagnosis().trim().isEmpty()) {

            throw new RuntimeException("Diagnosis is required");
        }


        if (updatedTreatment.getTreatmentDate() == null) {

            throw new RuntimeException("Treatment date is required");
        }


        if (updatedTreatment.getAppointment() == null ||
                updatedTreatment.getAppointment().getAppointmentId() == 0) {

            throw new RuntimeException("Appointment ID is required");
        }


        AppointmentEntity appointment =
                appointmentRepository.findById(
                        updatedTreatment
                                .getAppointment()
                                .getAppointmentId()
                ).orElseThrow(() ->
                        new RuntimeException("Appointment not found"));



        existingTreatment.setAppointment(appointment);
        existingTreatment.setDiagnosis(
                updatedTreatment.getDiagnosis());
        existingTreatment.setPrescriptionDetails(
                updatedTreatment.getPrescriptionDetails());
        existingTreatment.setTreatmentNotes(
                updatedTreatment.getTreatmentNotes());
        existingTreatment.setTreatmentDate(
                updatedTreatment.getTreatmentDate());


        return treatmentRepository.save(existingTreatment);
    }


    public void deleteTreatment(Integer id) {

        TreatmentEntity treatment =
                treatmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Treatment not found"));

        treatmentRepository.delete(treatment);
    }
}