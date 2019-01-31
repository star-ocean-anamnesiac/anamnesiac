import { NgModule } from '@angular/core';
import { AppIconComponent } from './appicon/appicon.component';
import { ElementComponent } from './element/element.component';
import { SlayerComponent } from './slayer/slayer.component';
import { WeaponComponent } from './weapon/weapon.component';
import { EffectComponent } from './effect/effect.component';

@NgModule({
  declarations: [AppIconComponent, ElementComponent, SlayerComponent, WeaponComponent, EffectComponent],
  exports: [AppIconComponent, ElementComponent, SlayerComponent, WeaponComponent]
})
export class ComponentsModule {}
