package com.smartcare.Services;

import com.smartcare.Entity.*;
import com.smartcare.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PatientService {


    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private AdmissionRepository admissionRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private LaboratoryRepository laboratoryRepository;


    public List<PatientEntity> getAllPatients() {

        return patientRepository.findAll();
    }


    public PatientEntity addPatient(PatientEntity patient) {

        PatientEntity newPatient = new PatientEntity();

        newPatient.setFull_Name(patient.getFull_Name());
        newPatient.setBlood_Group(patient.getBlood_Group());
        newPatient.setDOB(patient.getDOB());
        newPatient.setGender(patient.getGender());
        newPatient.setAddress(patient.getAddress());
        newPatient.setContact_Number(patient.getContact_Number());
        newPatient.setEmergency_Contact_Information(
                patient.getEmergency_Contact_Information()
        );

        return patientRepository.save(newPatient);
    }


    public String deletePatientByID(int id){

        PatientEntity patient = patientRepository.findById(id).orElse(null);
        if(patient == null){
            return "Patient not found";
        }

        List<String> errors = new ArrayList<>();

        List<AppointmentEntity> appointments = appointmentRepository.findAppointmentsByPatientId(id);

        for (AppointmentEntity appointment : appointments) {

            if (!"Completed".equals(appointment.getAppointmentStatus())) {

                errors.add(
                        "Appointment " + appointment.getAppointmentId()
                                + " is not completed"
                );
            }
        }

        List<AdmissionEntity> admissions = admissionRepository.findAdmissionsByPatientId(id);

        for (AdmissionEntity admission : admissions) {

            String status = admission.getAdmissionStatus();

            if (!"Discharged".equals(admission.getAdmissionStatus())) {
                errors.add("Patient is not discharged");
            }
        }

        List<BillEntity> bills = billRepository.findBillsByPatientId(id);

        for (AdmissionEntity admission : admissions) {

            if (!"Discharged".equals(admission.getAdmissionStatus())) {

                errors.add(
                        "Admission " + admission.getAdmissionId()
                                + " is not discharged"
                );
            }
        }

        List<LaboratoryEntity> laboratoryTests =
                laboratoryRepository.findLaboratoriesByPatientId(id);

        for (LaboratoryEntity laboratory : laboratoryTests) {

            if (!"Completed".equals(laboratory.getTestStatus())) {

                errors.add(
                        "Laboratory test " + laboratory.getLabTestId()
                                + " is not completed"
                );
            }
        }

        if (!errors.isEmpty()) {

            return "Patient cannot be deleted:\n- "
                    + String.join("\n- ", errors);
        }
        patientRepository.deleteById(id);
        return "Patient deleted successfully";

    }

    public String updatePatient(int id, PatientEntity updatedPatient) {

        PatientEntity patient = patientRepository.findById(id).orElse(null);

        if (patient == null) {
            return "Patient not found";
        }

        patient.setFull_Name(updatedPatient.getFull_Name());
        patient.setBlood_Group(updatedPatient.getBlood_Group());
        patient.setDOB(updatedPatient.getDOB());
        patient.setGender(updatedPatient.getGender());
        patient.setAddress(updatedPatient.getAddress());
        patient.setContact_Number(updatedPatient.getContact_Number());
        patient.setEmergency_Contact_Information(
                updatedPatient.getEmergency_Contact_Information()
        );

        patientRepository.save(patient);

        return "Patient updated successfully";
    }

    public List<PatientEntity> searchPatients(
            Integer id,
            String name,
            String bloodGroup,
            String gender) {

        return patientRepository.searchPatients(
                id,
                name,
                bloodGroup,
                gender
        );
    }






}
