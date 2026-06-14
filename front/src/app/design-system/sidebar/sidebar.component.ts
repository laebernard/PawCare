import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideUser, LucideImages, LucideCalendar } from '@lucide/angular';
import { SelectedPetService } from '../../services/selected-pet.service';

interface NavItem {
  label: string;
  path: string;
  iconName: string;
}

@Component({
  selector: 'ds-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideUser, LucideImages, LucideCalendar],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly selectedPetService = inject(SelectedPetService);

  readonly galleryAndCalendar: NavItem[] = [
    { label: 'Galerie', path: '/dashboard/gallery', iconName: 'images' },
    { label: 'Calendrier', path: '/dashboard/calendar', iconName: 'calendar' },
  ];

  get profilePath(): string {
    const pet = this.selectedPetService.selectedPet();
    return pet ? `/dashboard/consult-profile/${pet.id}` : '/select-profile';
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}