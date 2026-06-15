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
    public List<ContactResponse> getAllContacts(HttpServletRequest request) {
        return service.getAllContacts(currentUser(request)).stream()
                .map(ContactResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ContactResponse getContact(@PathVariable Long id, HttpServletRequest request) {
        return ContactResponse.from(service.getContactById(id, currentUser(request)));
    }

    @PostMapping
    public ContactResponse createContact(@RequestBody Contact contact, HttpServletRequest request) {
        if (contact.getName() == null || contact.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        return ContactResponse.from(service.createContact(contact, currentUser(request)));
    }

    @PutMapping("/{id}")
    public ContactResponse updateContact(@PathVariable Long id, @RequestBody Contact contact, HttpServletRequest request) {
        return ContactResponse.from(service.updateContact(id, contact, currentUser(request)));
    }

    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable Long id, HttpServletRequest request) {
        service.deleteContact(id, currentUser(request));
    }

    private User currentUser(HttpServletRequest request) {
        return authService.resolveCurrentUser(request);
    }
}
