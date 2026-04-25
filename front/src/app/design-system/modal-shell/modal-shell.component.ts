import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'ds-modal-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-shell.component.html',
  styleUrls: ['./modal-shell.component.css'],
})
export class ModalShellComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() labelledById = 'ds-modal-title';
  @Input() closeAriaLabel = 'Fermer la fenêtre';
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
