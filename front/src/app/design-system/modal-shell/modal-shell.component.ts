import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ds-modal-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-shell.component.html',
  styleUrls: ['./modal-shell.component.css'],
})
export class ModalShellComponent implements AfterViewChecked {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() labelledById = 'ds-modal-title';
  @Input() closeAriaLabel = 'Fermer la fenêtre';
  @Output() close = new EventEmitter<void>();
  @ViewChild('modalPanel') modalPanel?: ElementRef<HTMLElement>;
  private wasOpen = false;

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

  ngAfterViewChecked(): void {
    if (this.isOpen && !this.wasOpen) {
      this.focusFirstElement();
    }

    this.wasOpen = this.isOpen;
  }

  onPanelKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const panel = this.modalPanel?.nativeElement;
    if (!panel) {
      return;
    }

    const focusableElements = this.getFocusableElements(panel);
    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private focusFirstElement(): void {
    const panel = this.modalPanel?.nativeElement;
    if (!panel) {
      return;
    }

    const focusableElements = this.getFocusableElements(panel);
    const target = focusableElements[0] ?? panel;
    target.focus();
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
  }
}
