import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalShellComponent } from './modal-shell.component';

@Component({
  standalone: true,
  imports: [ModalShellComponent],
  template: `
    <button id="outside">Outside</button>
    <ds-modal-shell [isOpen]="isOpen">
      <button id="inside-action" type="button">Inside</button>
    </ds-modal-shell>
  `,
})
class TestHostComponent {
  isOpen = true;
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

  afterEach(() => {
    document.querySelectorAll('[data-test-invoker="true"]').forEach((element) => element.remove());
  });

  const openModalFromInvoker = (): {
    closeButton: HTMLButtonElement;
    invoker: HTMLButtonElement;
    outsideAfterOpen: HTMLButtonElement;
  } => {
    const invoker = document.createElement('button');
    invoker.dataset['testInvoker'] = 'true';
    invoker.id = 'focus-invoker';
    document.body.appendChild(invoker);

    modalFixture.componentRef.setInput('isOpen', false);
    modalFixture.detectChanges();
    invoker.focus();
    modalFixture.componentRef.setInput('isOpen', true);
    modalFixture.detectChanges();

    const closeButton = modalFixture.nativeElement.querySelector('.ds-modal-close') as HTMLButtonElement;
    const outsideAfterOpen = document.createElement('button');
    outsideAfterOpen.dataset['testInvoker'] = 'true';
    outsideAfterOpen.id = 'focus-outside-after-open';
    document.body.appendChild(outsideAfterOpen);
    outsideAfterOpen.focus();

    return { closeButton, invoker, outsideAfterOpen };
  };

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

  it('restores focus to invoking control when closed programmatically', () => {
    const { outsideAfterOpen } = openModalFromInvoker();
    expect((document.activeElement as HTMLElement | null)?.id).toBe(outsideAfterOpen.id);

    modalFixture.componentRef.setInput('isOpen', false);
    modalFixture.detectChanges();

    expect((document.activeElement as HTMLElement | null)?.id).toBe('focus-invoker');
  });

  it('restores focus to invoking control when closed with close button', () => {
    const { closeButton, outsideAfterOpen } = openModalFromInvoker();
    const closeSpy = vi.fn();
    modalComponent.close.subscribe(closeSpy);
    expect((document.activeElement as HTMLElement | null)?.id).toBe(outsideAfterOpen.id);

    closeButton.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);

    modalFixture.componentRef.setInput('isOpen', false);
    modalFixture.detectChanges();

    expect((document.activeElement as HTMLElement | null)?.id).toBe('focus-invoker');
  });

  it('restores focus to invoking control when closed with backdrop click', () => {
    const { outsideAfterOpen } = openModalFromInvoker();
    const closeSpy = vi.fn();
    modalComponent.close.subscribe(closeSpy);
    const backdrop = modalFixture.nativeElement.querySelector('.ds-modal-backdrop') as HTMLDivElement;
    expect((document.activeElement as HTMLElement | null)?.id).toBe(outsideAfterOpen.id);

    backdrop.click();
    expect(closeSpy).toHaveBeenCalledTimes(1);

    modalFixture.componentRef.setInput('isOpen', false);
    modalFixture.detectChanges();

    expect((document.activeElement as HTMLElement | null)?.id).toBe('focus-invoker');
  });

  it('restores focus to invoking control when closed with Escape', () => {
    const { outsideAfterOpen } = openModalFromInvoker();
    const closeSpy = vi.fn();
    modalComponent.close.subscribe(closeSpy);
    expect((document.activeElement as HTMLElement | null)?.id).toBe(outsideAfterOpen.id);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closeSpy).toHaveBeenCalledTimes(1);

    modalFixture.componentRef.setInput('isOpen', false);
    modalFixture.detectChanges();

    expect((document.activeElement as HTMLElement | null)?.id).toBe('focus-invoker');
  });
});
