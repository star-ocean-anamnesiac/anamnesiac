import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShopsPage } from './shops.page';
import { ComponentsModule } from '../component.module';
import { ShopModal } from './shops.ui';

const routes: Routes = [
  {
    path: '',
    component: ShopsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

    ComponentsModule
  ],
  entryComponents: [ShopModal],
  declarations: [ShopsPage, ShopModal]
})
export class ShopsPageModule {}
