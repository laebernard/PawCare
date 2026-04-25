import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AnimalProfileSelectorPageComponent } from './animal-profile-selector-page.component';

describe('AnimalProfileSelectorPageComponent', () => {
  let fixture: ComponentFixture<AnimalProfileSelectorPageComponent>;
  let component: AnimalProfileSelectorPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalProfileSelectorPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalProfileSelectorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens add-animal modal when clicking add card', () => {
    const addCard = fixture.debugElement.query(By.css('.profile-item.add-profile'));
    addCard.nativeElement.click();
    fixture.detectChanges();

    expect(component.isAddAnimalModalOpen).toBe(true);
    const modalBackdrop = fixture.nativeElement.querySelector('.ds-modal-backdrop');
    expect(modalBackdrop).not.toBeNull();
  });

  it('closes modal on valid submit without creating a profile', () => {
    const initialCount = component.profiles.length;
    component.openAddAnimalModal();
    component.newAnimalForm = {
      name: 'Milo',
      breed: 'Berger',
      birthDate: '2022-01-01',
      color: 'Noir',
      weight: '12',
      identification: 'PUCE123',
      sterilized: 'yes',
      profilePhoto: new File(['photo'], 'milo.jpg', { type: 'image/jpeg' }),
    };

    component.submitAddAnimalForm(new Event('submit'));
    fixture.detectChanges();

    expect(component.isAddAnimalModalOpen).toBe(false);
    expect(component.profiles.length).toBe(initialCount);
  });
});
