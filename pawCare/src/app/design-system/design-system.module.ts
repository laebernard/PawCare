import { NgModule } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';
import { LightboxComponent } from './lightbox/lightbox.component';

@NgModule({
  imports: [TitleComponent, ButtonComponent, LightboxComponent],
  exports: [TitleComponent, ButtonComponent, LightboxComponent]
})
export class DesignSystemModule {}