package com.pawCare.back.contact;

import com.pawCare.back.auth.AuthService;
import com.pawCare.back.user.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/contacts")
public class ContactController {

    private final ContactService service;
    private final AuthService authService;

    public ContactController(ContactService service, AuthService authService) {
        this.service = service;
        this.authService = authService;
    }

    @GetMapping
    public List<Contact> getAllContacts(HttpServletRequest request) {
        return service.getAllContacts(currentUser(request));
    }

    @GetMapping("/{id}")
    public Contact getContact(@PathVariable Long id, HttpServletRequest request) {
        return service.getContactById(id, currentUser(request));
    }

    @PostMapping
    public Contact createContact(@RequestBody Contact contact, HttpServletRequest request) {
        if (contact.getName() == null || contact.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        return service.createContact(contact, currentUser(request));
    }

    @PutMapping("/{id}")
    public Contact updateContact(@PathVariable Long id, @RequestBody Contact contact, HttpServletRequest request) {
        return service.updateContact(id, contact, currentUser(request));
    }

    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable Long id, HttpServletRequest request) {
        service.deleteContact(id, currentUser(request));
    }

    private User currentUser(HttpServletRequest request) {
        return authService.resolveCurrentUser(request);
    }
}
