import { NgModule } from '@angular/core';
import { AppIconComponent } from './appicon/appicon.component';
import { ElementComponent } from './element/element.component';
import { SlayerComponent } from './slayer/slayer.component';

@NgModule({
  declarations: [AppIconComponent, ElementComponent, SlayerComponent],
  exports: [AppIconComponent, ElementComponent, SlayerComponent]
})
export class ComponentsModule {}
