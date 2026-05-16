import { Routes } from '@angular/router';
import { DesignSystemPageComponent } from './pages/design-system-page/design-system-page.component';
import { AnimalProfileSelectorPageComponent } from './pages/animal-profile-selector-page/animal-profile-selector-page.component';
import { AnimalProfilePageComponent } from './pages/animal-profile-page/animal-profile-page.component';
import { AnimalGalleryPageComponent } from './pages/animal-gallery-page/animal-gallery-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'sign-in',
    component: SignInPageComponent
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
    path: 'animals/gallery',
    component: AnimalGalleryPageComponent
  },
  {
    path: 'design-system',
    component: DesignSystemPageComponent
  },
];
