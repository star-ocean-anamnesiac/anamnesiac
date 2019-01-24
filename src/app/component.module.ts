import { NgModule } from '@angular/core';
import { AppIconComponent } from './appicon/appicon.component';
import { ElementComponent } from './element/element.component';
import { SlayerComponent } from './slayer/slayer.component';
import { WeaponComponent } from './weapon/weapon.component';

@NgModule({
  declarations: [AppIconComponent, ElementComponent, SlayerComponent, WeaponComponent],
  exports: [AppIconComponent, ElementComponent, SlayerComponent, WeaponComponent]
})
export class ComponentsModule {}
