package com.pawCare.back.pet;

import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;

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
    public List<PetResponse> getAllPets(@AuthenticationPrincipal User currentUser) {
        return service.getAllPets(currentUser).stream()
                .map(PetResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public PetResponse getPet(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        return PetResponse.from(service.getPetById(id, currentUser));
    }

    @PostMapping
    public PetResponse createPet(@RequestBody PetRequest payload, @AuthenticationPrincipal User currentUser) {
        if (payload.name() == null || payload.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (payload.birthDate() != null && payload.birthDate().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La date de naissance ne peut pas être dans le futur"
            );
        }
        Pet pet = payload.toEntity();
        return PetResponse.from(service.createPet(pet, currentUser));
    }

    @PutMapping("/{id}")
    public PetResponse updatePet(@PathVariable Long id, @RequestBody PetRequest payload, @AuthenticationPrincipal User currentUser) {
        Pet existing = service.getPetById(id, currentUser);
        payload.applyTo(existing);
        return PetResponse.from(service.updatePet(id, existing, currentUser));
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        service.deletePet(id, currentUser);
    }

    @Value("${app.base-url}")
    private String baseUrl;
    @PostMapping("/upload")
    public String upload(@RequestParam MultipartFile file) throws IOException {
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return baseUrl + "/uploads/" + fileName;
    }

}
