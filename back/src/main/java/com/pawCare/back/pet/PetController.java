package com.pawCare.back.pet;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final PetService service;

    public PetController(PetService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return service.getAllPets();
    }

    @GetMapping("/{id}")
    public Pet getPet(@PathVariable Long id) {
        return service.getPetById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Pet> getPetsByUser(@PathVariable String userId) {
        return service.getPetsByUserId(userId);
    }

    @PostMapping
    public Pet createPet(@RequestBody Pet pet) {

        if (pet.getUserId() == null || pet.getUserId().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "UserId is required"
            );
        }

        if (pet.getBirthDate() != null && pet.getBirthDate().isAfter(LocalDate.now())) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "La date de naissance ne peut pas être dans le futur"
        );
    }

        return service.createPet(pet);
    }
}