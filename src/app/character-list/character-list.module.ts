import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { CharacterListPage, CharacterModal, CharacterSortPopover } from './character-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CharacterListPage
      }
    ])
  ],
  entryComponents: [CharacterModal, CharacterSortPopover],
  declarations: [CharacterListPage, CharacterModal, CharacterSortPopover]
})
export class CharacterListPageModule {}
