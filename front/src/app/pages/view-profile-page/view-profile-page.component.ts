import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DesignSystemModule } from '../../design-system/design-system.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-profile-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './view-profile-page.component.html',
  styleUrls: ['./view-profile-page.component.css'],
})
export class ViewProfilePageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = computed(() => this.authService.currentUser());

  ngOnInit(): void {
    if (!this.authService.currentUser()) {
      this.authService.fetchCurrentUser().subscribe();
    }
  }

  goToEditProfile(): void {
    this.router.navigate(['/dashboard/edit-profil']);
  }
}
