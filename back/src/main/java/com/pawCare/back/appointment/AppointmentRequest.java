package com.pawCare.back.appointment;

import java.time.LocalDateTime;

public class AppointmentRequest {

    private LocalDateTime date;
    private String address;
    private String reason;
    private Long animalId;
    private Long veterinaryId;

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Long getAnimalId() { return animalId; }
    public void setAnimalId(Long animalId) { this.animalId = animalId; }

    public Long getVeterinaryId() { return veterinaryId; }
    public void setVeterinaryId(Long veterinaryId) { this.veterinaryId = veterinaryId; }
}
