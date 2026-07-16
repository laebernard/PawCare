package com.pawCare.back.user;

import com.pawCare.back.security.PasswordPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return new RegisterResponse(false, "Email déjà utilisé");
        }

        if (!PasswordPolicy.isValid(request.getPassword())) {
            return new RegisterResponse(false, PasswordPolicy.ERROR_MESSAGE);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getFirstName(), request.getLastName(), request.getEmail(), hashedPassword);
        repository.save(user);

        return new RegisterResponse(true, "Compte créé avec succès");
    }

    public User updateMe(User currentUser, UpdateUserRequest request) {
        String firstName = request.getFirstName() == null ? "" : request.getFirstName().trim();
        String lastName = request.getLastName() == null ? "" : request.getLastName().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();

        if (firstName.isBlank() || lastName.isBlank() || email.isBlank()) {
            throw new IllegalArgumentException("Tous les champs sont obligatoires");
        }

        if (repository.existsByEmailAndIdNot(email, currentUser.getId())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        currentUser.setFirstName(firstName);
        currentUser.setLastName(lastName);
        currentUser.setEmail(email);

        return repository.save(currentUser);
    }

    public void updatePassword(User currentUser, UpdatePasswordRequest request) {
        String currentPassword = request.getCurrentPassword() == null ? "" : request.getCurrentPassword();
        String newPassword = request.getNewPassword() == null ? "" : request.getNewPassword();

        if (currentPassword.isBlank() || newPassword.isBlank()) {
            throw new IllegalArgumentException("Tous les champs sont obligatoires");
        }

        if (!PasswordPolicy.isValid(newPassword)) {
            throw new IllegalArgumentException(PasswordPolicy.ERROR_MESSAGE);
        }

        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("Ancien mot de passe incorrect");
        }

        currentUser.setPassword(passwordEncoder.encode(newPassword));
        repository.save(currentUser);
    }
}
