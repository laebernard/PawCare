import { Component } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  imports: [DesignSystemModule],
  templateUrl: './design-system-page.component.html'
})
export class DesignSystemPageComponent {
  lightboxOpen = false;
  demoImageUrl = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800';
  demoImageDescription = 'Ceci est une description de note pour l\'image. Tu peux écrire ce que tu veux ici.';

  openLightbox(): void {
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }
}