import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent {
  @Input() variant: 'simple' | 'button' | 'underlined' = 'simple';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() href?: string;
  @Input() disabled = false;

  get linkClasses(): string {
    const disabledClass = this.disabled || !this.href ? 'ds-link-disabled' : '';
    return `ds-link ds-link-${this.variant} ds-link-size-${this.size} ${disabledClass}`.trim();
  }

  handleClick(event: Event): void {
    if (this.disabled || !this.href) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
