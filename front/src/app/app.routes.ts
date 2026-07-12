import { Routes } from '@angular/router';
import { DesignSystemPageComponent } from './pages/design-system-page/design-system-page.component';
import { AnimalProfileSelectorPageComponent } from './pages/animal-profile-selector-page/animal-profile-selector-page.component';
import { AnimalProfilePageComponent } from './pages/animal-profile-page/animal-profile-page.component';
import { AnimalGalleryPageComponent } from './pages/animal-gallery-page/animal-gallery-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { ContactsListPageComponent } from './pages/contacts-list-page/contacts-list-page.component';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { ViewProfilePageComponent } from './pages/view-profile-page/view-profile-page.component';
import { EditProfilePageComponent } from './pages/edit-profile-page/edit-profile-page.component';
import { UpdatePasswordPageComponent } from './pages/update-password-page/update-password-page.component';
import { ExpensesPageComponent } from './pages/expenses-page/expenses-page.component';
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
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
  },
  {
    path: 'select-profile',
    component: AnimalProfileSelectorPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'gallery',
        pathMatch: 'full',
      },
      {
        path: 'consult-profile/:id',
        component: AnimalProfilePageComponent,
      },
      {
        path: 'gallery',
        component: AnimalGalleryPageComponent,
      },
      {
        path: 'calendar',
        component: CalendarPageComponent,
      },
      {
        path: 'expenses',
        component: ExpensesPageComponent,
      },
      {
        path: 'contacts',
        component: ContactsListPageComponent,
      },
      {
        path: 'view-profil',
        component: ViewProfilePageComponent,
      },
      {
        path: 'edit-profil',
        component: EditProfilePageComponent,
      },
      {
        path: 'update-password',
        component: UpdatePasswordPageComponent,
      },
    ],
  },
  {
    path: 'design-system',
    component: DesignSystemPageComponent,
  },
];