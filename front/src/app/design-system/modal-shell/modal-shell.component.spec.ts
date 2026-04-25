import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalShellComponent } from './modal-shell.component';

describe('ModalShellComponent', () => {
  let fixture: ComponentFixture<ModalShellComponent>;
  let component: ModalShellComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalShellComponent);
    component = fixture.componentInstance;
    component.isOpen = true;
    fixture.detectChanges();
  });

  it('emits close when clicking backdrop', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    const backdrop = fixture.nativeElement.querySelector('.ds-modal-backdrop') as HTMLElement;
    backdrop.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('emits close when clicking close button', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    const closeButton = fixture.nativeElement.querySelector('.ds-modal-close') as HTMLButtonElement;
    closeButton.click();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('emits close on escape key when open', () => {
    const closeSpy = vi.fn();
    component.close.subscribe(closeSpy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
