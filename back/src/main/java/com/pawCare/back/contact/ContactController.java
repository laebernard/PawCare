package com.pawCare.back.contact;

import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/contacts")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    public List<ContactResponse> getAllContacts(@AuthenticationPrincipal User currentUser) {
        return service.getAllContacts(currentUser).stream()
                .map(ContactResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ContactResponse getContact(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        return ContactResponse.from(service.getContactById(id, currentUser));
    }

    @PostMapping
    public ContactResponse createContact(@RequestBody Contact contact, @AuthenticationPrincipal User currentUser) {
        if (contact.getName() == null || contact.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        return ContactResponse.from(service.createContact(contact, currentUser));
    }

    @PutMapping("/{id}")
    public ContactResponse updateContact(@PathVariable Long id, @RequestBody Contact contact, @AuthenticationPrincipal User currentUser) {
        return ContactResponse.from(service.updateContact(id, contact, currentUser));
    }

    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        service.deleteContact(id, currentUser);
    }
}
