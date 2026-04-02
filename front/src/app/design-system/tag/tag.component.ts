import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'ds-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent {
  @Input() label: string = '';
  @Input() type: 'food' | 'health' | 'wellness' = 'food';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private iconMap: Record<'food' | 'health' | 'wellness', string> = {
    food: '🥗',
    health: '💊',
    wellness: '🌿'
  };

  getIcon(): string {
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