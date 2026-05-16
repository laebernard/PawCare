package com.pawCare.back.user;

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

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getFirstName(), request.getLastName(), request.getEmail(), hashedPassword);
        repository.save(user);

        return new RegisterResponse(true, "compte créé avec succès");
    }
}
