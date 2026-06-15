package com.pawCare.back.pet;

import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PetService {

    private final PetRepository repository;

    public PetService(PetRepository repository) {
        this.repository = repository;
    }

    public List<Pet> getAllPets(User currentUser) {
        return repository.findByUserId(currentUser.getId());
    }

    public Pet getPetById(Long id, User currentUser) {
        return repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
    }

    public Pet createPet(Pet pet, User currentUser) {
        pet.setUser(currentUser);
        return repository.save(pet);
    }

    public Pet updatePet(Long id, Pet updated, User currentUser) {
        Pet existing = repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
        existing.setName(updated.getName());
        existing.setBreed(updated.getBreed());
        existing.setBirthDate(updated.getBirthDate());
        existing.setColor(updated.getColor());
        existing.setWeight(updated.getWeight());
        existing.setIdentification(updated.getIdentification());
        existing.setSterilized(updated.getSterilized());
        existing.setImageUrl(updated.getImageUrl());
        existing.setType(updated.getType());
        return repository.save(existing);
    }

    public void deletePet(Long id, User currentUser) {
        Pet existing = repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
        repository.delete(existing);
    }
}
