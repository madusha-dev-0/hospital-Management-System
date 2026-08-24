package com.smartcare.Services;

import com.smartcare.Entity.DoctorEntity;
import com.smartcare.Entity.LaboratoryEntity;
import com.smartcare.Entity.PatientEntity;
import com.smartcare.Repository.DoctorRepository;
import com.smartcare.Repository.LaboratoryRepository;
import com.smartcare.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratoryService {

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;


    public LaboratoryEntity addTest(LaboratoryEntity test) {


        if (test.getTestName() == null ||
                test.getTestName().trim().isEmpty()) {

            throw new RuntimeException("Test name is required");
        }


        if (test.getTestDate() == null) {

            throw new RuntimeException("Test date is required");
        }


        if (test.getPatient() == null ||
                test.getPatient().getPatient_ID() == null) {

            throw new RuntimeException("Patient ID is required");
        }

        PatientEntity patient = patientRepository
                .findById(test.getPatient().getPatient_ID())
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));


        if (test.getDoctor() == null ||
                test.getDoctor().getDoctor_ID() == null) {

            throw new RuntimeException("Doctor ID is required");
        }

        DoctorEntity doctor = doctorRepository
                .findById(test.getDoctor().getDoctor_ID())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));


        test.setPatient(patient);
        test.setDoctor(doctor);

        if (test.getTestStatus() == null ||
                test.getTestStatus().trim().isEmpty()) {

            test.setTestStatus("Pending");
        }

        return laboratoryRepository.save(test);
    }



    public List<LaboratoryEntity> getAllTests() {

        return laboratoryRepository.findAll();
    }



    public LaboratoryEntity updateTest(
            Integer id,
            LaboratoryEntity updatedTest) {

        LaboratoryEntity existingTest =
                laboratoryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Laboratory test not found"));

        if (existingTest.getTestStatus() != null &&
                existingTest.getTestStatus()
                        .equalsIgnoreCase("Completed")) {

            throw new RuntimeException(
                    "Completed laboratory test cannot be updated");
        }


        if (updatedTest.getTestName() == null ||
                updatedTest.getTestName().trim().isEmpty()) {

            throw new RuntimeException("Test name is required");
        }


        if (updatedTest.getTestDate() == null) {

            throw new RuntimeException("Test date is required");
        }

        if (updatedTest.getPatient() == null ||
                updatedTest.getPatient().getPatient_ID() == null) {

            throw new RuntimeException("Patient ID is required");
        }

        PatientEntity patient =
                patientRepository.findById(
                        updatedTest.getPatient().getPatient_ID()
                ).orElseThrow(() ->
                        new RuntimeException("Patient not found"));


        if (updatedTest.getDoctor() == null ||
                updatedTest.getDoctor().getDoctor_ID() == null) {

            throw new RuntimeException("Doctor ID is required");
        }

        DoctorEntity doctor =
                doctorRepository.findById(
                        updatedTest.getDoctor().getDoctor_ID()
                ).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        existingTest.setPatient(patient);
        existingTest.setDoctor(doctor);
        existingTest.setTestName(updatedTest.getTestName());
        existingTest.setTestDate(updatedTest.getTestDate());
        existingTest.setTestResult(updatedTest.getTestResult());
        existingTest.setTechnicianName(updatedTest.getTechnicianName());

        if (updatedTest.getTestStatus() != null &&
                !updatedTest.getTestStatus().trim().isEmpty()) {

            existingTest.setTestStatus(
                    updatedTest.getTestStatus());
        }

        return laboratoryRepository.save(existingTest);
    }

    public void deleteTest(Integer id) {

        LaboratoryEntity test =
                laboratoryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Laboratory test not found"));

        if (test.getTestStatus() != null &&
                test.getTestStatus()
                        .equalsIgnoreCase("Completed")) {

            throw new RuntimeException(
                    "Completed laboratory test cannot be deleted");
        }


        laboratoryRepository.delete(test);
    }

    public List<LaboratoryEntity> searchLaboratories(
            Integer id,
            java.sql.Date testDate,
            String testStatus) {

        if (id == null &&
                testDate == null &&
                (testStatus == null || testStatus.trim().isEmpty())) {

            throw new RuntimeException(
                    "Please provide Laboratory ID, Test Date or Test Status");
        }

        return laboratoryRepository.searchLaboratories(
                id,
                testDate,
                testStatus
        );
    }

}