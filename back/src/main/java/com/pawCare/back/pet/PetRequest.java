package com.pawCare.back.pet;

import java.time.LocalDate;

/**
 * Inbound payload for creating or updating a {@link Pet}.
 * Deliberately does not include the owning user — the back-end resolves
 * the owner from the authenticated session, which prevents clients from
 * spoofing the {@code userId} in the request body.
 */
public record PetRequest(
        String name,
        String breed,
        LocalDate birthDate,
        String color,
        Double weight,
        String identification,
        Boolean sterilized,
        String imageUrl,
        PetType type
) {
    public Pet toEntity() {
        return new Pet(null, name, breed, birthDate, color, weight,
                identification, sterilized, imageUrl, type);
    }

    public void applyTo(Pet pet) {
        pet.setName(name);
        pet.setBreed(breed);
        pet.setBirthDate(birthDate);
        pet.setColor(color);
        pet.setWeight(weight);
        pet.setIdentification(identification);
        pet.setSterilized(sterilized);
        pet.setImageUrl(imageUrl);
        pet.setType(type);
    }
}
