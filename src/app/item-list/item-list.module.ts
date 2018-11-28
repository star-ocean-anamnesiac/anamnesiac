import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { ItemListPage } from './item-list.page';
import { ItemModal, ItemSortPopover } from './item-list.ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: ItemListPage
      }
    ])
  ],
  entryComponents: [ItemModal, ItemSortPopover],
  declarations: [ItemListPage, ItemModal, ItemSortPopover]
})
export class ItemListPageModule {}
