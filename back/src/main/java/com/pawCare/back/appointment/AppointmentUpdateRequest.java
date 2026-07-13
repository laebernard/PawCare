package com.pawCare.back.appointment;

import java.time.LocalDateTime;

/**
 * Inbound payload for updating an {@link Appointment}.
 * Deliberately omits the pet — only the date, address, reason and contact
 * can be changed after creation.
 */
public record AppointmentUpdateRequest(
        LocalDateTime date,
        String address,
        String reason,
        Long contactId
) {}
