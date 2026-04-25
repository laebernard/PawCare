import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideImagePlus } from '@lucide/angular';

@Component({
  selector: 'ds-image-upload-field',
  standalone: true,
  imports: [CommonModule, LucideImagePlus],
  templateUrl: './image-upload-field.component.html',
  styleUrls: ['./image-upload-field.component.css'],
})
export class ImageUploadFieldComponent {
  @Input() inputId = 'ds-image-upload';
  @Input() title = 'Cliquer pour choisir une image';
  @Input() subtitle = 'PNG, JPG · max 10 Mo';
  @Input() accept = 'image/png,image/jpeg';
  @Input() selectedFileName: string | null = null;
  @Input() required = false;
  @Output() fileSelected = new EventEmitter<File | null>();

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileSelected.emit(input.files?.[0] ?? null);
  }
}
