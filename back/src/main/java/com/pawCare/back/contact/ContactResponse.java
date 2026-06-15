package com.pawCare.back.contact;

/**
 * Public representation of a {@link Contact} returned by the HTTP layer.
 * Intentionally excludes the owning {@link com.pawCare.back.user.User} and any
 * internal fields so we never leak credentials or expose cross-tenant data.
 */
public record ContactResponse(
        Long id,
        String name,
        ContactType type,
        String phone,
        String address
) {
    public static ContactResponse from(Contact contact) {
        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getType(),
                contact.getPhone(),
                contact.getAddress()
        );
    }
}
