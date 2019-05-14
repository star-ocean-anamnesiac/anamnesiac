import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AppIconComponent } from './appicon/appicon.component';
import { ElementComponent } from './element/element.component';
import { SlayerComponent } from './slayer/slayer.component';
import { WeaponComponent } from './weapon/weapon.component';
import { EffectComponent } from './effect/effect.component';
import { LazyImgComponent } from './lazy-img/lazy-img.component';

@NgModule({
  imports: [IonicModule],
  declarations: [AppIconComponent, ElementComponent, SlayerComponent, WeaponComponent, EffectComponent, LazyImgComponent],
  exports: [AppIconComponent, ElementComponent, SlayerComponent, WeaponComponent, EffectComponent, LazyImgComponent]
})
export class ComponentsModule {}
