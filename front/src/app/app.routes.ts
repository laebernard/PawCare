import { Routes } from '@angular/router';
import { DesignSystemPageComponent } from './pages/design-system-page/design-system-page.component';
import { AnimalProfileSelectorPageComponent } from './pages/animal-profile-selector-page/animal-profile-selector-page.component';
import { AnimalProfilePageComponent } from './pages/animal-profile-page/animal-profile-page.component';
import { AnimalGalleryPageComponent } from './pages/animal-gallery-page/animal-gallery-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'sign-in',
    component: SignInPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'select-profile',
    component: AnimalProfileSelectorPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'consult-profile/:id',
    component: AnimalProfilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'animals/gallery',
    component: AnimalGalleryPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'design-system',
    component: DesignSystemPageComponent,
  },
];
