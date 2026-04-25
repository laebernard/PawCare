import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  standalone: true,
  imports: [ModalShellComponent],
  template: `
    <button id="outside">Outside</button>
    <ds-modal-shell [isOpen]="isOpen" (close)="onClose()">
      <button id="inside-action" type="button">Inside</button>
    </ds-modal-shell>
  `,
})
class TestHostComponent {
  isOpen = true;

  onClose(): void {}
}

describe('ModalShellComponent', () => {
  let modalFixture: ComponentFixture<ModalShellComponent>;
  let modalComponent: ModalShellComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalShellComponent, TestHostComponent],
    }).compileComponents();

    modalFixture = TestBed.createComponent(ModalShellComponent);
    modalComponent = modalFixture.componentInstance;
    modalComponent.isOpen = true;
    modalFixture.detectChanges();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits close when clicking backdrop', () => {
    const closeSpy = vi.fn();
    modalComponent.close.subscribe(closeSpy);

    const backdrop = modalFixture.nativeElement.querySelector('.ds-modal-backdrop') as HTMLElement;
    backdrop.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('emits close when clicking close button', () => {
    const closeSpy = vi.fn();
    modalComponent.close.subscribe(closeSpy);

    const closeButton = modalFixture.nativeElement.querySelector('.ds-modal-close') as HTMLButtonElement;
    closeButton.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('emits close on escape key when open', () => {
    const closeSpy = vi.fn();
    modalComponent.close.subscribe(closeSpy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('moves focus inside the modal when opened', () => {
    const closeButton = fixture.nativeElement.querySelector('.ds-modal-close') as HTMLButtonElement;
    expect(document.activeElement).toBe(closeButton);
  });

  it('traps tab focus within the modal', () => {
    const closeButton = fixture.nativeElement.querySelector('.ds-modal-close') as HTMLButtonElement;
    const insideButton = fixture.nativeElement.querySelector('#inside-action') as HTMLButtonElement;

    insideButton.focus();
    insideButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(closeButton);

    closeButton.focus();
    closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(insideButton);
  });
});
