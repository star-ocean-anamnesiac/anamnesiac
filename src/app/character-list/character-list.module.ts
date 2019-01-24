import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { CharacterListPage } from './character-list.page';
import { CharacterModal, CharacterSortPopover } from './character-list.ui';
import { ComponentsModule } from '../component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterPipeModule,
    ComponentsModule,
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
