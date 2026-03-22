import { NgModule } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [TitleComponent, ButtonComponent],
  exports: [TitleComponent, ButtonComponent]
})
export class DesignSystemModule {}