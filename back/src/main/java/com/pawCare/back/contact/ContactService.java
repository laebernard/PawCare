package com.pawCare.back.contact;

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

    public List<Contact> getAllContacts() {
        return repository.findAll();
    }

    public Contact getContactById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
    }

    public Contact createContact(Contact contact) {
        return repository.save(contact);
    }

    public Contact updateContact(Long id, Contact updated) {
        Contact existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        return repository.save(existing);
    }

    public void deleteContact(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found");
        }
        repository.deleteById(id);
    }
}
