package com.pawCare.back.appointment;

import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<AppointmentResponse> getAllAppointments(@AuthenticationPrincipal User currentUser) {
        return service.getAllAppointments(currentUser).stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public AppointmentResponse getAppointment(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        return AppointmentResponse.from(service.getAppointmentById(id, currentUser));
    }

    @PostMapping
    public AppointmentResponse createAppointment(@RequestBody AppointmentRequest request,
                                                 @AuthenticationPrincipal User currentUser) {
        if (request.date() == null
                || request.address() == null || request.address().isBlank()
                || request.reason() == null || request.reason().isBlank()
                || request.petId() == null
                || request.contactId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "All fields are required: date, address, reason, petId, contactId"
            );
        }
        return AppointmentResponse.from(service.createAppointment(request, currentUser));
    }
}
