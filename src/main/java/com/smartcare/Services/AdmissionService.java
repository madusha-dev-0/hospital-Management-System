package com.smartcare.Services;

import com.smartcare.Entity.AdmissionEntity;
import com.smartcare.Entity.PatientEntity;
import com.smartcare.Entity.RoomEntity;
import com.smartcare.Repository.AdmissionRepository;
import com.smartcare.Repository.PatientRepository;
import com.smartcare.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class AdmissionService {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private RoomRepository roomRepository;



    public AdmissionEntity addAdmission(AdmissionEntity admission) {


        if (admission.getPatient() == null ||
                admission.getPatient().getPatient_ID() == null) {

            throw new RuntimeException("Patient ID is required");
        }

        PatientEntity patient =
                patientRepository.findById(
                        admission.getPatient().getPatient_ID()
                ).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        if (admission.getRoom() == null ||
                admission.getRoom().getRoomID() == null) {

            throw new RuntimeException("Room ID is required");
        }

        RoomEntity room =
                roomRepository.findById(
                        admission.getRoom().getRoomID()
                ).orElseThrow(() ->
                        new RuntimeException("Room not found"));

        if (room.getAvailability() == null ||
                !room.getAvailability()
                        .equalsIgnoreCase("Available")) {

            throw new RuntimeException(
                    "Room is not available"
            );
        }

        if (admission.getAdmissionDate() == null) {

            throw new RuntimeException(
                    "Admission date is required"
            );
        }

        if (admission.getBedNumber() == null ||
                admission.getBedNumber().trim().isEmpty()) {

            throw new RuntimeException(
                    "Bed number is required"
            );
        }

        admission.setPatient(patient);
        admission.setRoom(room);

        if (admission.getAdmissionStatus() == null ||
                admission.getAdmissionStatus()
                        .trim().isEmpty()) {

            admission.setAdmissionStatus("Admitted");
        }

        room.setAvailability("Occupied");
        roomRepository.save(room);


        return admissionRepository.save(admission);
    }

    public List<AdmissionEntity> getAllAdmissions() {

        return admissionRepository.findAll();
    }


    public AdmissionEntity updateAdmission(
            Integer id,
            AdmissionEntity updatedAdmission) {

        AdmissionEntity existingAdmission =
                admissionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admission not found"
                                ));


        if (existingAdmission.getAdmissionStatus() != null &&
                existingAdmission.getAdmissionStatus()
                        .equalsIgnoreCase("Discharged")) {

            throw new RuntimeException(
                    "Discharged admission cannot be updated"
            );
        }

        if (updatedAdmission.getPatient() == null ||
                updatedAdmission.getPatient().getPatient_ID() == null) {

            throw new RuntimeException(
                    "Patient ID is required"
            );
        }

        PatientEntity patient =
                patientRepository.findById(
                        updatedAdmission
                                .getPatient()
                                .getPatient_ID()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        ));

        if (updatedAdmission.getRoom() == null ||
                updatedAdmission.getRoom().getRoomID() == null) {

            throw new RuntimeException(
                    "Room ID is required"
            );
        }

        RoomEntity newRoom =
                roomRepository.findById(
                        updatedAdmission
                                .getRoom()
                                .getRoomID()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Room not found"
                        ));

        if (!existingAdmission.getRoom()
                .getRoomID()
                .equals(newRoom.getRoomID())) {
            if (!"Available".equalsIgnoreCase(
                    newRoom.getAvailability())) {

                throw new RuntimeException(
                        "New room is not available"
                );
            }
            RoomEntity oldRoom =
                    existingAdmission.getRoom();

            oldRoom.setAvailability("Available");
            roomRepository.save(oldRoom);

            newRoom.setAvailability("Occupied");
            roomRepository.save(newRoom);
        }


        existingAdmission.setPatient(patient);
        existingAdmission.setRoom(newRoom);
        existingAdmission.setAdmissionDate(
                updatedAdmission.getAdmissionDate()
        );
        existingAdmission.setBedNumber(
                updatedAdmission.getBedNumber()
        );
        existingAdmission.setAdmissionStatus(
                updatedAdmission.getAdmissionStatus()
        );


        return admissionRepository.save(existingAdmission);
    }

    public AdmissionEntity dischargePatient(Integer id) {

        AdmissionEntity admission =
                admissionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admission not found"
                                ));

        if (admission.getAdmissionStatus() != null &&
                admission.getAdmissionStatus()
                        .equalsIgnoreCase("Discharged")) {

            throw new RuntimeException(
                    "Patient is already discharged"
            );
        }

        admission.setAdmissionStatus("Discharged");

        admission.setDischargeDate(
                new Date(System.currentTimeMillis())
        );



        RoomEntity room = admission.getRoom();

        if (room != null) {
            room.setAvailability("Available");
            roomRepository.save(room);
        }


        return admissionRepository.save(admission);
    }



    public void deleteAdmission(Integer id) {

        AdmissionEntity admission =
                admissionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admission not found"
                                ));



        if (admission.getAdmissionStatus() != null &&
                admission.getAdmissionStatus()
                        .equalsIgnoreCase("Admitted")) {

            throw new RuntimeException(
                    "Active admission cannot be deleted. Discharge the patient first."
            );
        }


        admissionRepository.delete(admission);
    }
}