import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, Observable } from 'rxjs';
import { DesignSystemModule } from '../../design-system/design-system.module';
import { Pet, PetService } from '../../services/pet.service';

@Component({
  selector: 'app-animal-profile-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './animal-profile-page.component.html',
  styleUrls: ['./animal-profile-page.component.css']
})
export class AnimalProfilePageComponent implements OnInit {

  pet$!: Observable<Pet | null>;
  currentPetId!: number;

  isUpdateAnimalModalOpen = false;

  newAnimalForm: any = {
    name: '',
    breed: '',
    birthDate: '',
    color: '',
    weight: '',
    identification: '',
    sterilized: '',
    profilePhoto: null,
    imageUrl: null
  };

  constructor(
    private petService: PetService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pet$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(null);

        this.currentPetId = Number(id);
        return this.petService.getPetById(this.currentPetId);
      })
    );
  }

  openEditPetModal(p: Pet): void {
    this.newAnimalForm = {
      name: p.name,
      breed: p.breed,
      birthDate: p.birthDate,
      color: p.color,
      weight: p.weight.toString(),
      identification: p.identification,
      sterilized: p.sterilized ? 'yes' : 'no',
      profilePhoto: null,
      imageUrl: p.imageUrl
    };

    this.isUpdateAnimalModalOpen = true;
  }

  closeUpdateAnimalModal(): void {
    this.isUpdateAnimalModalOpen = false;
  }

  onFieldInput(field: string, event: any): void {
    this.newAnimalForm[field] = event.target.value;
  }

  onSterilizedChange(event: any): void {
    this.newAnimalForm.sterilized = event.target.value;
  }

  onProfilePhotoSelected(file: File | null): void {
    this.newAnimalForm.profilePhoto = file;
  }

  isBirthDateValid(): boolean {
    return new Date(this.newAnimalForm.birthDate) <= new Date();
  }

  isUpdateAnimalFormValid(): boolean {
    return (
      this.newAnimalForm.name.trim() !== '' &&
      this.newAnimalForm.breed.trim() !== '' &&
      this.newAnimalForm.birthDate !== '' &&
      this.isBirthDateValid() &&
      this.newAnimalForm.color.trim() !== '' &&
      this.newAnimalForm.weight.trim() !== '' &&
      this.newAnimalForm.identification.trim() !== '' &&
      this.newAnimalForm.sterilized !== ''
    );
  }

  submitUpdateAnimalForm(event: Event): void {
    event.preventDefault();
    if (!this.isUpdateAnimalFormValid()) return;

    const payload: Pet = {
      id: this.currentPetId,
      userId: '1',
      name: this.newAnimalForm.name.trim(),
      breed: this.newAnimalForm.breed.trim(),
      birthDate: this.newAnimalForm.birthDate,
      color: this.newAnimalForm.color.trim(),
      weight: Number(this.newAnimalForm.weight),
      identification: this.newAnimalForm.identification.trim(),
      sterilized: this.newAnimalForm.sterilized === 'yes',
      imageUrl: this.newAnimalForm.imageUrl
    };

    if (this.newAnimalForm.profilePhoto) {
      this.petService.uploadImage(this.newAnimalForm.profilePhoto).subscribe({
        next: (imageUrl: string) => {
          payload.imageUrl = imageUrl;
          this.updatePet(payload);
        },
        error: (err) => console.error('Erreur upload image', err)
      });
    } else {
      this.updatePet(payload);
    }
  }

  private updatePet(payload: Pet): void {
    this.petService.updatePet(this.currentPetId, payload).subscribe({
      next: () => {
        this.isUpdateAnimalModalOpen = false;
        this.reloadPet();
      },
      error: (err) => console.error('Erreur modification pet', err)
    });
  }

  private reloadPet(): void {
    this.pet$ = this.petService.getPetById(this.currentPetId);
  }
}
