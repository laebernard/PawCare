import { NgModule } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CardComponent } from './card/card.component';
@NgModule({
  imports: [TitleComponent, ButtonComponent, LightboxComponent, AvatarComponent, CardComponent],
  exports: [TitleComponent, ButtonComponent, LightboxComponent, AvatarComponent, CardComponent]
})
export class DesignSystemModule {}