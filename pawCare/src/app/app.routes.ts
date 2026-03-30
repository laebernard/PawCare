import { Routes } from '@angular/router';
import { DesignSystemPageComponent } from './pages/design-system-page/design-system-page.component';
import { CreateAnimalPageComponent } from './pages/create-animal-page/create-animal-page.component';
import { AnimalProfileSelectorPageComponent } from './pages/animal-profile-selector-page/animal-profile-selector-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'select-profile',
    pathMatch: 'full'
  },
  {
    path: 'select-profile',
    component: AnimalProfileSelectorPageComponent
  },
  {
    path: 'design-system',
    component: DesignSystemPageComponent
  },
  {
    path: 'create-animal',
    component: CreateAnimalPageComponent
  }
];