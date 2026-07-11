import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideCheck, LucideX, LucidePawPrint } from '@lucide/angular';


@Component({
  selector: 'ds-tag',
  standalone: true,
  imports: [CommonModule, LucideCheck, LucideX, LucidePawPrint],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent {
  @Input() label: string = '';
  @Input() type: 'food' | 'health' | 'wellness' | 'sterilized' | 'race' = 'food';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() sterilized: boolean | null = null;

  private iconMap: Record<'food' | 'health' | 'wellness', string> = {
    food: '🥗',
    health: '💊',
    wellness: '🌿'
  };

  getSterilizedClass(): string {
    if (this.type !== 'sterilized') {
      return '';
    }

    return this.sterilized ? 'sterilized-true' : 'sterilized-false';
  }

  getIcon(): string {
    if (this.type === 'race' || this.type === 'sterilized') {
      return '';
    }

    const normalizedLabel = this.label.trim().toLowerCase();

    if (normalizedLabel.includes('food') || normalizedLabel.includes('nourriture')) {
      return this.iconMap.food;
    }

    if (normalizedLabel.includes('health') || normalizedLabel.includes('santé')) {
      return this.iconMap.health;
    }

    if (normalizedLabel.includes('wellness') || normalizedLabel.includes('bien-être')) {
      return this.iconMap.wellness;
    }

    return this.iconMap[this.type];
  }
}