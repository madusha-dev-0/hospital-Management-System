package com.smartcare.Services;

import com.smartcare.Entity.RoomEntity;
import com.smartcare.Repository.AdmissionRepository;
import com.smartcare.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

    public RoomEntity addRoom(RoomEntity room) {


        if (room.getRoomNumber() == null || room.getRoomNumber().trim().isEmpty()) {
            throw new RuntimeException("Room number is required");
        }


        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room number already exists");
        }


        if (room.getAvailability() == null ||
                room.getAvailability().trim().isEmpty()) {

            room.setAvailability("Available");
        }

        return roomRepository.save(room);
    }

    public List<RoomEntity> getAllRooms() {
        return roomRepository.findAll();
    }


    public RoomEntity updateRoom(Integer id, RoomEntity updatedRoom) {

        RoomEntity existingRoom = roomRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));


        if (admissionRepository.existsByRoom_RoomId(id)) {

            throw new RuntimeException(
                    "Cannot update room. This room is currently assigned to an admitted patient."
            );
        }

        if (!existingRoom.getRoomNumber()
                .equals(updatedRoom.getRoomNumber())) {

            if (roomRepository.existsByRoomNumber(
                    updatedRoom.getRoomNumber())) {

                throw new RuntimeException(
                        "Room number already exists");
            }
        }

        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setRoomCategory(updatedRoom.getRoomCategory());
        existingRoom.setRoomCharge(updatedRoom.getRoomCharge());
        existingRoom.setAvailability(updatedRoom.getAvailability());

        return roomRepository.save(existingRoom);
    }


    public void deleteRoom(Integer id) {

        RoomEntity room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        if (admissionRepository.existsByRoom_RoomId(id)) {

            throw new RuntimeException(
                    "Cannot delete room. This room is currently assigned to an admitted patient."
            );
        }

        roomRepository.delete(room);
    }


    public List<RoomEntity> getAvailableRooms() {

        return roomRepository.findByAvailability("Available");
    }



}
