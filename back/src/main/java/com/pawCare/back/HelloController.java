package com.pawCare.back;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Bienvenue sur PawCare 🐾";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello PawCare 🐾";
    }
}