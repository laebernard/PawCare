package com.pawCare.back.appointment;

import com.pawCare.back.contact.ContactType;
import java.time.LocalDateTime;

/**
 * Public representation of an {@link Appointment} returned by the HTTP layer.
 * Intentionally excludes the owning {@link com.pawCare.back.user.User} and any
 * internal fields so we never leak credentials or expose cross-tenant data.
 *
 * <p>{@code petName}, {@code contactName} and {@code contactType} are denormalised
 * here so the front-end can render an appointment without a second round-trip
 * per pet/contact.
 */
public record AppointmentResponse(
        Long id,
        LocalDateTime date,
        String address,
        String reason,
        Long petId,
        Long contactId,
        String petName,
        String contactName,
        ContactType contactType
) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDate(),
                appointment.getAddress(),
                appointment.getReason(),
                appointment.getPet().getId(),
                appointment.getContact().getId(),
                appointment.getPet().getName(),
                appointment.getContact().getName(),
                appointment.getContact().getType()
        );
    }
}
