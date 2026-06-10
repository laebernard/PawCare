package com.pawCare.back.appointment;

import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment createAppointment(AppointmentRequest request) {
        Appointment appointment = new Appointment(
                request.getDate(),
                request.getAddress(),
                request.getReason(),
                request.getAnimalId(),
                request.getVeterinaryId()
        );
        return repository.save(appointment);
    }
}
