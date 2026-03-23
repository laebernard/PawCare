import { NgModule } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  imports: [TitleComponent, ButtonComponent, LightboxComponent, AvatarComponent],
  exports: [TitleComponent, ButtonComponent, LightboxComponent, AvatarComponent]
})
export class DesignSystemModule {}