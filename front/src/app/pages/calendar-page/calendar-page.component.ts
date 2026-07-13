import { Component, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesignSystemModule } from '../../design-system/design-system.module';

import { AppointmentService, Appointment } from '../../services/appointment.service';
import { PetService, Pet } from '../../services/pet.service';
import { ContactService, ContactType } from '../../services/contact.service';
import { SelectedPetService } from '../../services/selected-pet.service';

const TYPE_LABELS: Record<ContactType, string> = {
  VET: 'Vétérinaire',
  GROOMER: 'Toiletteur',
  PET_SITTER: 'Pet-sitter',
  EMERGENCY: 'Urgence',
  OTHER: 'Autre',
};

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTH_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DesignSystemModule],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
})
export class CalendarPageComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly petService = inject(PetService);
  private readonly contactService = inject(ContactService);
  private readonly selectedPetService = inject(SelectedPetService);

  readonly appointments = this.appointmentService.appointments;
  readonly loading = this.appointmentService.loading;
  readonly error = this.appointmentService.error;
  readonly contacts = this.contactService.contacts;

  readonly pets = signal<Pet[]>([]);

  readonly currentMonth = signal(new Date());
  readonly selectedDate = signal<Date | null>(null);
  readonly isDrawerOpen = signal(false);
  readonly isCreateOpen = signal(false);
  readonly submitting = signal(false);
  readonly isDeleteOpen = signal(false);
  readonly deleting = signal(false);
  readonly appointmentToDelete = signal<Appointment | null>(null);
  readonly isEditOpen = signal(false);
  readonly updating = signal(false);
  readonly appointmentToEdit = signal<Appointment | null>(null);

  newAppointment = this.emptyForm();
  editAppointmentForm = this.emptyEditForm();

  readonly calendarDays = computed(() => this.buildCalendarDays());

  readonly monthLabel = computed(() => {
    const d = this.currentMonth();
    return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
  });

  readonly selectedDateLabel = computed(() => {
    const d = this.selectedDate();
    if (!d) return '';
    return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
  });

  readonly appointmentsByDate = computed(() => {
    const map: Record<string, Appointment[]> = {};
    for (const appointment of this.appointments()) {
      const key = this.dateKey(new Date(appointment.date));
      if (!map[key]) map[key] = [];
      map[key].push(appointment);
    }
    return map;
  });

  readonly selectedDateAppointments = computed(() => {
    const date = this.selectedDate();
    if (!date) return [];
    return this.appointmentsByDate()[this.dateKey(date)] ?? [];
  });

  ngOnInit(): void {
    this.appointmentService.loadAppointments().subscribe();
    this.petService.getMyPets().subscribe((pets) => this.pets.set(pets));
    this.contactService.loadContacts().subscribe();
  }

  previousMonth(): void {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() - 1);
    this.currentMonth.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() + 1);
    this.currentMonth.set(d);
  }

  goToToday(): void {
    this.currentMonth.set(new Date());
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isDrawerOpen()) {
      this.closeDrawer();
    }
  }

  openCreate(): void {
    this.newAppointment = this.emptyForm();
    this.newAppointment.date = this.defaultDateTime(new Date());
    this.isCreateOpen.set(true);
  }

  openCreateForSelected(): void {
    this.newAppointment = this.emptyForm();
    const base = this.selectedDate() ?? new Date();
    this.newAppointment.date = this.defaultDateTime(base);
    this.isCreateOpen.set(true);
  }

  closeCreate(): void {
    this.isCreateOpen.set(false);
    this.newAppointment = this.emptyForm();
  }

  isCreateFormValid(): boolean {
    const f = this.newAppointment;
    return (
      f.date !== '' &&
      f.address.trim() !== '' &&
      f.reason.trim() !== '' &&
      f.petId !== null &&
      f.contactId !== null
    );
  }

  submitCreate(event: Event): void {
    event.preventDefault();
    if (!this.isCreateFormValid() || this.submitting()) return;

    const f = this.newAppointment;
    const iso = f.date.length === 16 ? `${f.date}:00` : f.date;

    this.submitting.set(true);
    this.appointmentService.createAppointment({
      date: iso,
      address: f.address.trim(),
      reason: f.reason.trim(),
      petId: f.petId!,
      contactId: f.contactId!,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeCreate();
      },
      error: (err) => {
        this.submitting.set(false);
        console.error('Erreur création rendez-vous', err);
      },
    });
  }

  onEditAppointment(appt: Appointment): void {
    this.appointmentToEdit.set(appt);
    this.editAppointmentForm = {
      date: this.toLocalInputValue(new Date(appt.date)),
      address: appt.address,
      reason: appt.reason,
      contactId: appt.contactId as number | null,
    };
    this.isEditOpen.set(true);
  }

  closeEditModal(): void {
    if (this.updating()) return;
    this.isEditOpen.set(false);
    this.appointmentToEdit.set(null);
    this.editAppointmentForm = this.emptyEditForm();
  }

  isEditFormValid(): boolean {
    const f = this.editAppointmentForm;
    return f.date !== '' && f.address.trim() !== '' && f.reason.trim() !== '' && f.contactId !== null;
  }

  submitEdit(event: Event): void {
    event.preventDefault();
    const appt = this.appointmentToEdit();
    if (!appt || !this.isEditFormValid() || this.updating()) return;

    const f = this.editAppointmentForm;
    const iso = f.date.length === 16 ? `${f.date}:00` : f.date;

    this.updating.set(true);
    this.appointmentService.updateAppointment(appt.id, {
      date: iso,
      address: f.address.trim(),
      reason: f.reason.trim(),
      contactId: f.contactId!,
    }).subscribe({
      next: () => {
        this.updating.set(false);
        this.closeEditModal();
      },
      error: (err) => {
        this.updating.set(false);
        console.error('Erreur modification rendez-vous', err);
      },
    });
  }

  onDeleteAppointment(appt: Appointment): void {
    this.appointmentToDelete.set(appt);
    this.isDeleteOpen.set(true);
  }

  closeDeleteConfirm(): void {
    if (this.deleting()) return;
    this.isDeleteOpen.set(false);
    this.appointmentToDelete.set(null);
  }

  confirmDeleteAppointment(): void {
    const appt = this.appointmentToDelete();
    if (!appt || this.deleting()) return;

    this.deleting.set(true);
    this.appointmentService.deleteAppointment(appt.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.isDeleteOpen.set(false);
        this.appointmentToDelete.set(null);
      },
      error: (err) => {
        this.deleting.set(false);
        console.error('Erreur suppression rendez-vous', err);
      },
    });
  }

  typeLabel(type: ContactType): string {
    return TYPE_LABELS[type] ?? TYPE_LABELS.OTHER;
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  appointmentsForDate(date: Date): Appointment[] {
    return this.appointmentsByDate()[this.dateKey(date)] ?? [];
  }

  isToday(date: Date): boolean {
    const t = new Date();
    return (
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    );
  }

  private emptyForm() {
    const selectedPetId = this.selectedPetService.selectedPet()?.id ?? null;
    return {
      date: '',
      address: '',
      reason: '',
      petId: selectedPetId as number | null,
      contactId: null as number | null,
    };
  }

  private emptyEditForm() {
    return {
      date: '',
      address: '',
      reason: '',
      contactId: null as number | null,
    };
  }

  private defaultDateTime(base: Date): string {
    const d = new Date(base);
    d.setHours(d.getHours() + 1, 0, 0, 0);
    return this.toLocalInputValue(d);
  }

  private toLocalInputValue(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d}T${hh}:${mm}`;
  }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private buildCalendarDays(): (Date | null)[] {
    const month = new Date(this.currentMonth());
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const days: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, monthIndex, d));
    }
    return days;
  }

  readonly dayLabels = DAY_LABELS;
}
