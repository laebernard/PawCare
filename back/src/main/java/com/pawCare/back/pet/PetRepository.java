package com.pawCare.back.pet;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class PetRepository {

    private final List<Pet> pets = new ArrayList<>();

    public PetRepository() {
        pets.add(new Pet(
                "1",
                "1",
                "Milo",
                "Teckel à poils durs",
                "2020-05-12",
                "Roux",
                4.5,
                "250268712345678",
                true,
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400"
        ));

        pets.add(new Pet(
                "2",
                "1",
                "Luna",
                "Siamois",
                "2019-08-03",
                "Blanc",
                3.8,
                "250268712999999",
                false,
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400"
        ));
    }

    public List<Pet> findAll() {
        return pets;
    }

    public Optional<Pet> findById(String id) {
        return pets.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    public List<Pet> findByUserId(String userId) {
    return pets.stream()
            .filter(pet -> pet.getUserId().equals(userId))
            .toList();
}
}