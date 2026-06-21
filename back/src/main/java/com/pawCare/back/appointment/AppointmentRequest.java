package com.pawCare.back.appointment;

import java.time.LocalDateTime;

/**
 * Inbound payload for creating an {@link Appointment}.
 * Deliberately does not include the owning user — the back-end resolves
 * the owner from the authenticated session, which prevents clients from
 * spoofing the {@code userId} in the request body.
 */
public record AppointmentRequest(
        LocalDateTime date,
        String address,
        String reason,
        Long petId,
        Long contactId
) {}
