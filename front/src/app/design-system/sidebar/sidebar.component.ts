import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideUser, LucideImages, LucideCalendar, LucideHeart } from '@lucide/angular';

interface NavItem {
  label: string;
  path: string;
  iconName: string;
}

@Component({
  selector: 'ds-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideUser, LucideImages, LucideCalendar, LucideHeart],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly router = inject(Router);

  @Input() logo = 'Paw Care';

  readonly navItems: NavItem[] = [
    { label: 'Mon animal', path: '/dashboard/consult-profile', iconName: 'user' },
    { label: 'Galerie', path: '/dashboard/gallery', iconName: 'images' },
    { label: 'Calendrier', path: '/dashboard/calendar', iconName: 'calendar' },
  ];

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }
}