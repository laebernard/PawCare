package com.pawCare.back.appointment;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private Long animalId;

    @Column(nullable = false)
    private Long veterinaryId;

    public Appointment() {}

    public Appointment(LocalDateTime date, String address, String reason, Long animalId, Long veterinaryId) {
        this.date = date;
        this.address = address;
        this.reason = reason;
        this.animalId = animalId;
        this.veterinaryId = veterinaryId;
    }

    public Long getId() { return id; }

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
