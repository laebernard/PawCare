import { NgModule } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { ButtonComponent } from './button/button.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CardComponent } from './card/card.component';
import { LinkComponent } from './link/link.component';
import { InputComponent } from './input/input.component';
import { TagComponent } from './tag/tag.component';
import { ModalShellComponent } from './modal-shell/modal-shell.component';
import { ImageUploadFieldComponent } from './image-upload-field/image-upload-field.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    TitleComponent,
    ButtonComponent,
    LightboxComponent,
    AvatarComponent,
    CardComponent,
    LinkComponent,
    InputComponent,
    TagComponent,
    ModalShellComponent,
    ImageUploadFieldComponent,
    NavbarComponent,
  ],
  exports: [
    TitleComponent,
    ButtonComponent,
    LightboxComponent,
    AvatarComponent,
    CardComponent,
    LinkComponent,
    InputComponent,
    TagComponent,
    ModalShellComponent,
    ImageUploadFieldComponent,
    NavbarComponent,
  ],
})
export class DesignSystemModule {}
