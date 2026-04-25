import { Routes } from '@angular/router';
import { DesignSystemPageComponent } from './pages/design-system-page/design-system-page.component';
import { AnimalProfileSelectorPageComponent } from './pages/animal-profile-selector-page/animal-profile-selector-page.component';
import { AnimalGalleryPageComponent } from './pages/animal-gallery-page/animal-gallery-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'select-profile',
    component: AnimalProfileSelectorPageComponent
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
