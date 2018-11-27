import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { CharacterListPage, CharacterModal } from './character-list.page';

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
  entryComponents: [CharacterModal],
  declarations: [CharacterListPage, CharacterModal]
})
export class CharacterListPageModule {}
