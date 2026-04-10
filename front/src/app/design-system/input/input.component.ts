import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() placeholder: string = '';
  @Input() state: 'default' | 'active' | 'disabled' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'small';

  onFocus() {
    if (this.state !== 'disabled') this.state = 'active';
  }

  onBlur() {
    if (this.state !== 'disabled') this.state = 'default';
  }
}