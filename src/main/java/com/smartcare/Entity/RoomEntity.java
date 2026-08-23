package com.smartcare.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "room")
public class RoomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Room_ID")
    private Integer roomId;
    private String roomNumber;
    private String roomCategory;
    private BigDecimal roomCharge;
    private String availability;

    public RoomEntity(){}


    public Integer getRoomID() {
        return roomId;
    }

    public void setRoomID(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomCategory() {
        return roomCategory;
    }

    public void setRoomCategory(String roomCategory) {
        this.roomCategory = roomCategory;
    }

    public BigDecimal getRoomCharge() {
        return roomCharge;
    }

    public void setRoomCharge(BigDecimal roomCharge) {
        this.roomCharge = roomCharge;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }
}
