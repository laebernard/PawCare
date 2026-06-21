package com.pawCare.back.appointment;

import java.time.LocalDateTime;

/**
 * Public representation of an {@link Appointment} returned by the HTTP layer.
 * Intentionally excludes the owning {@link com.pawCare.back.user.User} and any
 * internal fields so we never leak credentials or expose cross-tenant data.
 */
public record AppointmentResponse(
        Long id,
        LocalDateTime date,
        String address,
        String reason,
        Long petId,
        Long contactId
) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDate(),
                appointment.getAddress(),
                appointment.getReason(),
                appointment.getPet().getId(),
                appointment.getContact().getId()
        );
    }
}
