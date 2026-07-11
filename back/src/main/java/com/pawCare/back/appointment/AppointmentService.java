package com.pawCare.back.appointment;

import com.pawCare.back.contact.Contact;
import com.pawCare.back.contact.ContactService;
import com.pawCare.back.pet.Pet;
import com.pawCare.back.pet.PetService;
import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;
    private final PetService petService;
    private final ContactService contactService;

    public AppointmentService(AppointmentRepository repository, PetService petService, ContactService contactService) {
        this.repository = repository;
        this.petService = petService;
        this.contactService = contactService;
    }

    public List<Appointment> getAllAppointments(User currentUser) {
        return repository.findByUserId(currentUser.getId());
    }

    public Appointment getAppointmentById(Long id, User currentUser) {
        return repository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
    }

    public Appointment createAppointment(AppointmentRequest request, User currentUser) {
        Pet pet = petService.getPetById(request.petId(), currentUser);
        Contact contact = contactService.getContactById(request.contactId(), currentUser);
        Appointment appointment = new Appointment(
                currentUser, pet, contact, request.date(), request.address(), request.reason()
        );
        return repository.save(appointment);
    }

    public void deleteAppointment(Long id, User currentUser) {
    Appointment appointment = repository.findByIdAndUserId(id, currentUser.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    repository.delete(appointment);
}
}
