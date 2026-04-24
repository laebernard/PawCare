import { Routes } from '@angular/router';
import { DesignSystemPageComponent } from './pages/design-system-page/design-system-page.component';
import { AnimalProfileSelectorPageComponent } from './pages/animal-profile-selector-page/animal-profile-selector-page.component';
import { AnimalProfilePageComponent } from './pages/animal-profile-page/animal-profile-page.component';

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
    path: 'consult-profile/:id',
    component: AnimalProfilePageComponent
  },
  {
    path: 'design-system',
    component: DesignSystemPageComponent
  },
];