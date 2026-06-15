package com.pawCare.back.pet;

import java.time.LocalDate;

/**
 * Public representation of a {@link Pet} returned by the HTTP layer.
 * Intentionally excludes the owning {@link com.pawCare.back.user.User} so
 * we never leak credentials or expose cross-tenant data.
 */
public record PetResponse(
        Long id,
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
    public static PetResponse from(Pet pet) {
        return new PetResponse(
                pet.getId(),
                pet.getName(),
                pet.getBreed(),
                pet.getBirthDate(),
                pet.getColor(),
                pet.getWeight(),
                pet.getIdentification(),
                pet.getSterilized(),
                pet.getImageUrl(),
                pet.getType()
        );
    }
}
