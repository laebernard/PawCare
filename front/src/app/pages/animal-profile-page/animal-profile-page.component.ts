import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, Observable } from 'rxjs';
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

  pet$!: Observable<Pet | null>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pet$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(null);

        return this.http.get<Pet>(`http://localhost:8080/pets/${id}`);
      })
    );
  }
}