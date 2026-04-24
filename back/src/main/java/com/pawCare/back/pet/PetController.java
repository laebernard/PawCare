package com.pawCare.back.pet;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "http://localhost:4200")
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
    public Pet getPet(@PathVariable String id) {
        return service.getPetById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Pet> getPetsByUser(@PathVariable String userId) {
        return service.getPetsByUserId(userId);
    }
}