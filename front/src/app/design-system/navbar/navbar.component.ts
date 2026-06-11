import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHeart } from '@lucide/angular';

import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../button/button.component';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'ds-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideHeart, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoggedIn = this.auth.isLoggedIn;

  readonly links: NavLink[] = [
    { label: 'Accueil', path: '/' },
    { label: 'Nous rejoindre', path: '/sign-in' },
  ];

  readonly visibleLinks = computed(() =>
    this.isLoggedIn() ? this.links.filter(l => l.path !== '/sign-in') : this.links
  );

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/']);
  }
}