
import { includes, sortBy } from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Item } from '../models/item';

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Choose Party Character</ion-title>
      <ion-buttons slot="end">
        <ion-button icon-only (click)="search = !search">
          <ion-icon name="search"></ion-icon>
        </ion-button>
        <ion-button (click)="dismiss()">
          Close
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>

    <div class="stars small"></div>
    <div class="stars medium"></div>
    <div class="stars large"></div>

    <ion-searchbar *ngIf="search"
                   showCancelButton
                   (ionCancel)="closeSearch()"
                   (ionInput)="updateSearchValue($event)"
    ></ion-searchbar>

    <div class="blank-slate" *ngIf="filteredItems.length === 0">
      There are no items for this region.
    </div>

    <ion-list *ngIf="filteredItems.length > 0">
      <ion-item (click)="selectItem(null)">
        Clear this item slot
      </ion-item>
      
      <ion-item *ngFor="let item of filteredItems" (click)="selectItem(item)">

        <span slot="start" class="picture-class-chunk">
          <app-appicon [name]="item.picture" [forceWidth]="64" [forceHeight]="64" type="item"></app-appicon>
          <app-appicon margin-horizontal [name]="'menu-' + item.subtype" [scaleX]="0.375" [scaleY]="0.375"></app-appicon>
        </span>

        <ion-label>
          <h2 class="vertical-center">
            <app-appicon [name]="'char-' + item.star" [scaleX]="0.5" [scaleY]="0.5" [inline]="true"></app-appicon>
            <span>{{ item.name }}</span>
          </h2>
        </ion-label>
      </ion-item>
    </ion-list>

  </ion-content>
  `,
  styles: [`
  `]
})
export class ItemListModal implements OnInit {

  public items: Item[] = [];
  public filteredItems: Item[] = [];

  public search: boolean;
  public searchValue: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.search = true;
    this.items = this.navParams.get('items');
    this.updateFilteredItems();
  }

  updateSearchValue(ev) {
    if(!ev.detail) {
      this.searchValue = '';
      return;
    }
    const str = ev.target.value;
    this.searchValue = str;

    this.updateFilteredItems();
  }

  closeSearch() {
    this.search = false;
    this.searchValue = '';
    this.updateFilteredItems();
  }

  private updateFilteredItems() {
    let sortedItems = sortBy(this.items, 'name');

    if(this.searchValue) {
      sortedItems = sortedItems.filter(x => includes(x.name.toLowerCase(), this.searchValue.toLowerCase()));
    }

    this.filteredItems = sortedItems;
  }

  selectItem(item: Item) {
    this.modalCtrl.dismiss(item);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
