package com.pawCare.back.pet;

import com.pawCare.back.auth.AuthService;
import com.pawCare.back.user.User;
import jakarta.servlet.http.HttpServletRequest;
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
    private final AuthService authService;

    public PetController(PetService service, AuthService authService) {
        this.service = service;
        this.authService = authService;
    }

    @GetMapping
    public List<PetResponse> getAllPets(HttpServletRequest request) {
        return service.getAllPets(currentUser(request)).stream()
                .map(PetResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public PetResponse getPet(@PathVariable Long id, HttpServletRequest request) {
        return PetResponse.from(service.getPetById(id, currentUser(request)));
    }

    @PostMapping
    public PetResponse createPet(@RequestBody PetRequest payload, HttpServletRequest request) {
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
        return PetResponse.from(service.createPet(pet, currentUser(request)));
    }

    @PutMapping("/{id}")
    public PetResponse updatePet(@PathVariable Long id, @RequestBody PetRequest payload, HttpServletRequest request) {
        Pet existing = service.getPetById(id, currentUser(request));
        payload.applyTo(existing);
        return PetResponse.from(service.updatePet(id, existing, currentUser(request)));
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Long id, HttpServletRequest request) {
        service.deletePet(id, currentUser(request));
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

    private User currentUser(HttpServletRequest request) {
        return authService.resolveCurrentUser(request);
    }
}
