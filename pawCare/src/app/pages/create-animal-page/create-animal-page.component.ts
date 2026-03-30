import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DesignSystemModule } from '../../design-system/design-system.module';

@Component({
  selector: 'app-create-animal-page',
  standalone: true,
  imports: [FormsModule, DesignSystemModule],
  templateUrl: './create-animal-page.component.html',
  styleUrls: ['./create-animal-page.component.css']
})
export class CreateAnimalPageComponent {
  animalForm = {
    name: '',
    type: '',
    breed: '',
    weight: '',
    birth: '',
    color: ''
  };

  selectedPhoto: string | null = null;

  onPhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedPhoto = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
