import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '../../design-system/design-system.module';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'vet' | 'groomer' | 'other';
}

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTH_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
})
export class CalendarPageComponent {
  readonly currentMonth = signal(new Date());
  readonly selectedDate = signal<Date | null>(null);
  readonly isModalOpen = signal(false);

  private readonly eventsStore = signal<Record<string, CalendarEvent[]>>({
    // Stubs — replace with real API data
  });

  readonly calendarDays = computed(() => this.buildCalendarDays());

  readonly monthLabel = computed(() => {
    const d = this.currentMonth();
    return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
  });

  readonly selectedDateEvents = computed(() => {
    const d = this.selectedDate();
    if (!d) return [];
    const key = this.dateKey(d);
    return this.eventsStore()[key] ?? [];
  });

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
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  getTypeLabel(type: CalendarEvent['type']): string {
    const map: Record<CalendarEvent['type'], string> = {
      vet: 'Vétérinaire',
      groomer: 'Toiletteur',
      other: 'Autre',
    };
    return map[type];
  }

  private buildCalendarDays(): (Date | null)[] {
    const today = new Date();
    const month = new Date(this.currentMonth());
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    // Monday-first weekday index (0=Mon, 6=Sun)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const days: (Date | null)[] = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, monthIndex, d));
    }

    return days;
  }

  isToday(date: Date): boolean {
    const t = new Date();
    return (
      date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear()
    );
  }

  isSelected(date: Date): boolean {
    const s = this.selectedDate();
    if (!s) return false;
    return (
      date.getDate() === s.getDate() &&
      date.getMonth() === s.getMonth() &&
      date.getFullYear() === s.getFullYear()
    );
  }

  hasEvents(date: Date): boolean {
    const key = this.dateKey(date);
    return (this.eventsStore()[key]?.length ?? 0) > 0;
  }

  eventCountForDate(date: Date): number {
    const key = this.dateKey(date);
    return this.eventsStore()[key]?.length ?? 0;
  }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  readonly dayLabels = DAY_LABELS;
}
