import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHeart } from '@lucide/angular';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'ds-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideHeart],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  readonly links: NavLink[] = [
    { label: 'Accueil', path: '/' },
    { label: 'Nous rejoindre', path: '/register' },
  ];

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
