import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideUser, LucideImages, LucideCalendar, LucideUsers, LucideDog, LucideSettings, LucideWallet } from '@lucide/angular';
import { SelectedPetService } from '../../services/selected-pet.service';

interface NavItem {
  label: string;
  path: string;
  iconName: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'ds-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideUser, LucideImages, LucideCalendar, LucideUsers, LucideDog, LucideSettings, LucideWallet],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly selectedPetService = inject(SelectedPetService);

  readonly sections: NavSection[] = [
    {
      label: 'Mon espace',
      items: [
        { label: 'Mon animal', path: '/dashboard/consult-profile', iconName: 'user' },
        { label: 'Galerie', path: '/dashboard/gallery', iconName: 'images' },
        { label: 'Calendrier', path: '/dashboard/calendar', iconName: 'calendar' },
        { label: 'Dépenses', path: '/dashboard/expenses', iconName: 'wallet' },
        { label: 'Mon profil', path: '/dashboard/view-profil', iconName: 'settings' },
        { label: 'Changer de compagnon', path: '/select-profile', iconName: 'dog' },
      ],
    },
    {
      label: 'Contacts',
      items: [
        { label: 'Mes contacts', path: '/dashboard/contacts', iconName: 'users' },
      ],
    },
  ];

  get profilePath(): string {
    const pet = this.selectedPetService.selectedPet();
    return pet ? `/dashboard/consult-profile/${pet.id}` : '/select-profile';
  }

  resolvePath(item: NavItem): string {
    return item.path === '/dashboard/consult-profile' ? this.profilePath : item.path;
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}
