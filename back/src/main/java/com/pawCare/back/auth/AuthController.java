package com.pawCare.back.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final ForgotPasswordService forgotPasswordService;

    public AuthController(AuthService authService, ForgotPasswordService forgotPasswordService) {
        this.authService = authService;
        this.forgotPasswordService = forgotPasswordService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@CookieValue(name = "jwt", required = false) String token) {
        return authService.getCurrentUser(token);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return forgotPasswordService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ForgotPasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        return forgotPasswordService.resetPassword(request);
    }
}