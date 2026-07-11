package com.pawCare.back.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = service.register(request);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/users/me")
    public ResponseEntity<UpdateUserResponse> updateMe(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdateUserRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new UpdateUserResponse(false, "Non autorisé", null));
        }

        try {
            User updated = service.updateMe(currentUser, request);
            UserPublicResponse payload = new UserPublicResponse(
                    updated.getId(),
                    updated.getFirstName(),
                    updated.getLastName(),
                    updated.getEmail()
            );
            return ResponseEntity.ok(new UpdateUserResponse(true, "Profil mis à jour avec succès", payload));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new UpdateUserResponse(false, e.getMessage(), null));
        }
    }

    @PutMapping("/users/me/password")
    public ResponseEntity<UpdatePasswordResponse> updatePassword(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdatePasswordRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new UpdatePasswordResponse(false, "Non autorisé"));
        }

        try {
            service.updatePassword(currentUser, request);
            return ResponseEntity.ok(new UpdatePasswordResponse(true, "Mot de passe mis à jour avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new UpdatePasswordResponse(false, e.getMessage()));
        }
    }
}
