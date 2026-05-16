package com.pawCare.back.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}
