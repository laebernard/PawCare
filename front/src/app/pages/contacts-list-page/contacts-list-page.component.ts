import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DesignSystemModule } from '../../design-system/design-system.module';

import { ContactService, ContactType } from '../../services/contact.service';

const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  VET: 'Vétérinaire',
  GROOMER: 'Toiletteur',
  PET_SITTER: 'Pet-sitter',
  EMERGENCY: "Contact d'urgence",
  OTHER: 'Autre',
};

@Component({
  selector: 'app-contacts-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DesignSystemModule],
  templateUrl: './contacts-list-page.component.html',
  styleUrls: ['./contacts-list-page.component.css'],
})
export class ContactsListPageComponent implements OnInit {
  private readonly contactService = inject(ContactService);

  readonly contacts = this.contactService.contacts;
  readonly loading = this.contactService.loading;
  readonly error = this.contactService.error;

  showCreateModal = false;

  newContact = {
    name: '',
    phone: '',
    email: '',
    address: '',
    type: null as ContactType | null,
  };

  errors = {
    name: '',
    type: '',
    phone: '',
    email: '',
  };

  ngOnInit(): void {
    this.contactService.loadContacts().subscribe();
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newContact = {
      name: '',
      phone: '',
      email: '',
      address: '',
      type: null,
    };

    this.errors = {
      name: '',
      type: '',
      phone: '',
      email: '',
    };
  }

  validateForm(): boolean {
    let valid = true;

    this.errors = { name: '', type: '', phone: '', email: '' };

    // Nom obligatoire
    if (!this.newContact.name.trim()) {
      this.errors.name = 'Le nom du contact est obligatoire.';
      valid = false;
    }

    // Catégorie obligatoire
    if (!this.newContact.type) {
      this.errors.type = 'Veuillez sélectionner une catégorie.';
      valid = false;
    }

    // Téléphone : 10 chiffres
    if (this.newContact.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(this.newContact.phone)) {
        this.errors.phone = 'Le numéro doit contenir exactement 10 chiffres.';
        valid = false;
      }
    }

    // Email valide
    if (this.newContact.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.newContact.email)) {
        this.errors.email = 'Veuillez saisir une adresse email valide.';
        valid = false;
      }
    }

    return valid;
  }

  isCreateContactFormValid(): boolean {
    return (
      this.newContact.name.trim() !== '' &&
      this.newContact.type !== null &&
      !this.errors.name &&
      !this.errors.type &&
      !this.errors.phone &&
      !this.errors.email
    );
  }

  submitCreateContact(event: Event): void {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.contactService.createContact({
      name: this.newContact.name,
      phone: this.newContact.phone || null,
      email: this.newContact.email || null,
      address: this.newContact.address || null,
      type: this.newContact.type!,
    }).subscribe({
      next: () => {
        this.closeCreateModal();
        this.contactService.loadContacts().subscribe();
      },
      error: (err) => console.error('Erreur création contact', err),
    });
  }

  labelFor(type: ContactType | null): string {
    return type ? CONTACT_TYPE_LABELS[type] : 'Non classé';
  }

  deleteContact(id: number): void {
    if (!confirm("Voulez-vous vraiment supprimer ce contact ?")) return;

    this.contactService.deleteContact(id).subscribe();
  }


}


