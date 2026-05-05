package com.pawCare.back.pet;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    private final PetRepository repository;

    public PetService(PetRepository repository) {
        this.repository = repository;
    }

    public List<Pet> getAllPets() {
        return repository.findAll();
    }

    public Pet getPetById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
    }

    public List<Pet> getPetsByUserId(String userId) {
        return repository.findByUserId(userId);
    }
}