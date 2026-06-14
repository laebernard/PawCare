package com.pawCare.back.login;

import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    private static final int COOKIE_MAX_AGE = 3 * 60 * 60; // 3 hours in seconds

    private final LoginService service;

    public LoginController(LoginService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = service.login(request);

        String token = response.getData().getToken();
        Cookie jwtCookie = new Cookie("jwt", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(COOKIE_MAX_AGE);
        jwtCookie.setSecure(false); // true en prod si HTTPS

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, buildCookieHeader(jwtCookie));

        return ResponseEntity.ok().headers(headers).body(response);
    }

    private static String buildCookieHeader(Cookie cookie) {
        return String.format("jwt=%s; HttpOnly; Path=%s; Max-Age=%d",
                cookie.getValue(), cookie.getPath(), cookie.getMaxAge());
    }
}
