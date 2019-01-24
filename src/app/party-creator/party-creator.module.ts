import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PartyCreatorPage } from './party-creator.page';
import { CharacterListModal } from './character-list.modal';
import { ComponentsModule } from '../component.module';

const routes: Routes = [
  {
    path: '',
    component: PartyCreatorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [CharacterListModal],
  declarations: [PartyCreatorPage, CharacterListModal]
})
export class PartyCreatorPageModule {}
