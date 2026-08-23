package com.smartcare.Controller;

import com.smartcare.Entity.RoomEntity;
import com.smartcare.Services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/addroom")
    public ResponseEntity<?> addRoom(
            @RequestBody RoomEntity room) {

        try {
            RoomEntity savedRoom = roomService.addRoom(room);

            return new ResponseEntity<>(
                    savedRoom,
                    HttpStatus.CREATED
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllRooms() {

        try {
            return ResponseEntity.ok(
                    roomService.getAllRooms()
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/updateroom/{id}")
    public ResponseEntity<?> updateRoom(
            @PathVariable Integer id,
            @RequestBody RoomEntity room) {

        try {

            RoomEntity updatedRoom =
                    roomService.updateRoom(id, room);

            return ResponseEntity.ok(updatedRoom);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @DeleteMapping("/deleteroom/{id}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable Integer id) {

        try {

            roomService.deleteRoom(id);

            return ResponseEntity.ok(
                    "Room deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailableRooms() {

        try {

            return ResponseEntity.ok(
                    roomService.getAvailableRooms()
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}