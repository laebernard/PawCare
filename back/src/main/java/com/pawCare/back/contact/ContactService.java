package com.pawCare.back.contact;

import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository repository;

    public ContactService(ContactRepository repository) {
        this.repository = repository;
    }

    public List<Contact> getAllContacts(User currentUser) {
        return repository.findByUserId(currentUser.getId());
    }

    public Contact getContactById(Long id, User currentUser) {
        return repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
    }

    public Contact createContact(Contact contact, User currentUser) {
        contact.setUser(currentUser);
        return repository.save(contact);
    }

    public Contact updateContact(Long id, Contact updated, User currentUser) {
        Contact existing = repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        return repository.save(existing);
    }

    public void deleteContact(Long id, User currentUser) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        Contact existing = repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
        repository.delete(existing);
    }
}
