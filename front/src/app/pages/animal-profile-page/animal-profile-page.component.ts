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

  constructor(
    private petService: PetService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pet$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) return of(null);

        return this.petService.getPetById(Number(id));
      })
    );
  }
}