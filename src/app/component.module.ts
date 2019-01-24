import { NgModule } from '@angular/core';
import { AppIconComponent } from './appicon/appicon.component';
import { ElementComponent } from './element/element.component';

@NgModule({
  declarations: [AppIconComponent, ElementComponent],
  exports: [AppIconComponent, ElementComponent]
})
export class ComponentsModule {}
