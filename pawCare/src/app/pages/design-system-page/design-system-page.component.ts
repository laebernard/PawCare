import { Component } from '@angular/core';
import { DesignSystemModule } from '../../design-system/design-system.module';

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  imports: [DesignSystemModule],
  templateUrl: './design-system-page.component.html'
})
export class DesignSystemPageComponent {}