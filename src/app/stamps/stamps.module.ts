import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StampsPage } from './stamps.page';
import { ComponentsModule } from '../component.module';

const routes: Routes = [
  {
    path: '',
    component: StampsPage
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
  declarations: [StampsPage]
})
export class StampsPageModule {}
