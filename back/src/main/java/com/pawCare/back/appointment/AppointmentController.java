package com.pawCare.back.appointment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        if (request.getDate() == null
                || request.getAddress() == null || request.getAddress().isBlank()
                || request.getReason() == null || request.getReason().isBlank()
                || request.getAnimalId() == null
                || request.getVeterinaryId() == null) {
            return ResponseEntity.badRequest().body("All fields are required: date, address, reason, animalId, veterinaryId");
        }

        Appointment created = service.createAppointment(request);
        return ResponseEntity.status(201).body(created);
    }
}
