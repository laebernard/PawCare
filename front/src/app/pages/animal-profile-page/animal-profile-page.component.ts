import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '../../design-system/design-system.module';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  color: string;
  weight: number;
  identification: string;
  sterilized: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-animal-profile-page',
  standalone: true,
  imports: [CommonModule, DesignSystemModule],
  templateUrl: './animal-profile-page.component.html',
  styleUrls: ['./animal-profile-page.component.css']
})
export class AnimalProfilePageComponent implements OnInit {
  pet: Pet;

  constructor() {
    this.pet = {
      id: '1',
      name: 'Milo',
      breed: 'Chat européen',
      birthDate: '2020-05-12',
      color: 'Roux',
      weight: 4.5,
      identification: '250268712345678',
      sterilized: true,
      imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
    };
  }

  ngOnInit(): void {}
}