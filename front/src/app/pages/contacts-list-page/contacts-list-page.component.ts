import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DesignSystemModule } from '../../design-system/design-system.module';

import { ContactService, Contact, ContactType } from '../../services/contact.service';

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

  newContact: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    type: ContactType | null;
  } = {
    name: '',
    phone: null,
    email: null,
    address: null,
    type: null,
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

  private resetForm(): void {
    this.newContact = {
      name: '',
      phone: null,
      email: null,
      address: null,
      type: null,
    };
  }

  submitCreateContact(event: Event): void {
    event.preventDefault();

    if (!this.newContact.name || !this.newContact.type) {
      return;
    }

    this.contactService.createContact({
      name: this.newContact.name,
      phone: this.newContact.phone,
      email: this.newContact.email,
      address: this.newContact.address,
      type: this.newContact.type,
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
}
