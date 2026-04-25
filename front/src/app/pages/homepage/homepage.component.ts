import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideCalendar, LucideCamera, LucideHeart, LucidePawPrint } from '@lucide/angular';
import { LinkComponent } from '../../design-system/link/link.component';
import { TitleComponent } from '../../design-system/title/title.component';

interface HeroImage {
  src: string;
  alt: string;
  rotate: number;
}

interface Feature {
  key: 'paw' | 'camera' | 'calendar' | 'heart';
  title: string;
  desc: string;
}

interface FloatingHeart {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, LinkComponent, TitleComponent, LucideHeart, LucideCalendar, LucideCamera, LucidePawPrint],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  readonly heroImages: HeroImage[] = [
    {
      src: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=480&h=600&fit=crop',
      alt: 'Lapin',
      rotate: -18,
    },
    {
      src: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=480&h=600&fit=crop',
      alt: 'Chien',
      rotate: -12,
    },
    {
      src: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=480&h=600&fit=crop',
      alt: 'Chat',
      rotate: -6,
    },
    {
      src: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=480&h=600&fit=crop',
      alt: 'Perroquet',
      rotate: 0,
    },
    {
      src: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=480&h=600&fit=crop',
      alt: 'Cacatoes',
      rotate: 6,
    },
    {
      src: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=480&h=600&fit=crop',
      alt: 'Hamster',
      rotate: 12,
    },
    {
      src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=480&h=600&fit=crop',
      alt: 'Poisson',
      rotate: 18,
    },
  ];

  get heroCenterIndex(): number {
    return Math.floor(this.heroImages.length / 2);
  }

  getHeroTranslateX(index: number): number {
    return (index - this.heroCenterIndex) * 75;
  }

  getHeroZIndex(index: number): number {
    const distance = Math.abs(index - this.heroCenterIndex);
    return this.heroImages.length - distance;
  }

  readonly features: Feature[] = [
    {
      key: 'paw',
      title: 'Profils animaux',
      desc: 'Creez un profil dedie pour chacun de vos compagnons a quatre pattes, a plumes ou a ecailles.',
    },
    {
      key: 'camera',
      title: 'Galerie photos',
      desc: 'Conservez tous les souvenirs precieux dans une galerie dediee avec notes et souvenirs.',
    },
    {
      key: 'calendar',
      title: 'Calendrier rendez-vous',
      desc: 'Gerez les rendez-vous veterinaires, toilettage et plus encore depuis un calendrier intuitif.',
    },
    {
      key: 'heart',
      title: 'Suivi sante',
      desc: 'Gardez un oeil sur la sante et le bien-etre de vos animaux au quotidien.',
    },
  ];

  readonly floatingHearts: FloatingHeart[] = [
    { top: 12, left: 8, size: 22, delay: 0, duration: 5.2 },
    { top: 25, left: 22, size: 30, delay: 0.7, duration: 6.4 },
    { top: 18, left: 42, size: 24, delay: 1.1, duration: 5.9 },
    { top: 36, left: 61, size: 20, delay: 1.6, duration: 6.8 },
    { top: 16, left: 78, size: 28, delay: 2.1, duration: 5.6 },
    { top: 52, left: 14, size: 26, delay: 2.5, duration: 6.3 },
    { top: 58, left: 48, size: 18, delay: 3.1, duration: 5.4 },
    { top: 63, left: 84, size: 24, delay: 3.8, duration: 6.1 },
  ];
}
