import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
  @Input() src: string | null = null;
  @Input() alt: string = 'Avatar';
  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' = 'medium';
  @Input() fallback: string = '?';
  @Input() href: string | null = null;
}
