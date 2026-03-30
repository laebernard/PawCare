import { NgModule } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CardComponent } from './card/card.component';
import { LinkComponent } from './link/link.component';

@NgModule({
  imports: [TitleComponent, ButtonComponent, LightboxComponent, AvatarComponent, CardComponent, LinkComponent],
  exports: [TitleComponent, ButtonComponent, LightboxComponent, AvatarComponent, CardComponent, LinkComponent]
})
export class DesignSystemModule {}