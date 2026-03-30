import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '../../design-system/design-system.module';
import { Router } from '@angular/router';

interface AnimalProfile {
  id: number;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
  breed: string;
  photoUrl: string | null;
  color: string;
}

@Component({
  selector: 'app-animal-profile-selector-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './animal-profile-selector-page.component.html',
  styleUrls: ['./animal-profile-selector-page.component.css'],
})
export class AnimalProfileSelectorPageComponent {
  profiles: AnimalProfile[] = [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Golden Retriever',
      photoUrl:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop&crop=face',
      color: 'blonde',
    },
    {
      id: 2,
      name: 'Luna',
      type: 'cat',
      breed: 'Siamese',
      photoUrl:
        'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=300&h=300&fit=crop&crop=face',
      color: 'white',
    },
    {
      id: 3,
      name: 'Charlie',
      type: 'dog',
      breed: 'French Bulldog',
      photoUrl:
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop&crop=face',
      color: 'brown',
    },
  ];

  selectedProfile: AnimalProfile | null = null;

  constructor(private router: Router) {}

  selectProfile(profile: AnimalProfile): void {
    this.selectedProfile = profile;
    // Navigate to the animal dashboard/profile page
    // For now, we'll just log it
    console.log('Selected profile:', profile);
  }

  goToCreateProfile(): void {
    this.router.navigate(['/create-animal']);
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
