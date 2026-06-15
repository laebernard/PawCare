import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';

import { ContactService, Contact, ContactType } from '../../services/contact.service';

const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  VET: 'Vétérinaire',
  GROOMER: 'Toiletteur',
  PET_SITTER: 'Pet-sitter',
  OTHER: 'Autre',
};

@Component({
  selector: 'app-contacts-list-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './contacts-list-page.component.html',
  styleUrls: ['./contacts-list-page.component.css'],
})
export class ContactsListPageComponent implements OnInit {
  private readonly contactService = inject(ContactService);

  readonly contacts = this.contactService.contacts;
  readonly loading = this.contactService.loading;
  readonly error = this.contactService.error;

  ngOnInit(): void {
    this.contactService.loadContacts().subscribe();
  }

  labelFor(type: ContactType | null): string {
    return type ? CONTACT_TYPE_LABELS[type] : 'Non classé';
  }

  trackById(_: number, contact: Contact): number {
    return contact.id;
  }
}
