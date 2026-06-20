package com.pawCare.back.pet;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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

    @PostMapping("/upload")
    public String upload(@RequestParam MultipartFile file) throws IOException {

        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        Path filePath = uploadDir.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        return "http://localhost:8081/uploads/" + fileName;
    }

    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet updatedPet) {

        Pet existingPet = service.getPetById(id);

        if (updatedPet.getBirthDate() != null && updatedPet.getBirthDate().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "La date de naissance ne peut pas être dans le futur"
            );
        }

        existingPet.setName(updatedPet.getName());
        existingPet.setBreed(updatedPet.getBreed());
        existingPet.setBirthDate(updatedPet.getBirthDate());
        existingPet.setColor(updatedPet.getColor());
        existingPet.setWeight(updatedPet.getWeight());
        existingPet.setIdentification(updatedPet.getIdentification());
        existingPet.setSterilized(updatedPet.getSterilized());
        existingPet.setImageUrl(updatedPet.getImageUrl());

        return service.updatePet(existingPet);
    }



}