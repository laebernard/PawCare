import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../design-system/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="dashboard-layout">
      <ds-sidebar />
      <main class="dashboard-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .dashboard-content {
      flex: 1;
      min-width: 0;
      background: var(--color-canvas-white);
    }
  `],
})
export class DashboardLayoutComponent {}
