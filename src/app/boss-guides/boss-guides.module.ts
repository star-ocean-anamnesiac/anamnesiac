import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BossGuidesPage } from './boss-guides.page';
import { ComponentsModule } from '../component.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { BossGuideModal } from './boss-guides.ui';

const routes: Routes = [
  {
    path: '',
    component: BossGuidesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterPipeModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BossGuidesPage, BossGuideModal],
  entryComponents: [BossGuideModal]
})
export class BossGuidesPageModule {}
