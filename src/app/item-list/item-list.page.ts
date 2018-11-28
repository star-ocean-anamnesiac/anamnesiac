
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { markdown } from 'markdown';
import { LocalStorage } from 'ngx-webstorage';

import { ModalController, NavParams, Tabs, PopoverController } from '@ionic/angular';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.page.html',
  styleUrls: ['item-list.page.scss']
})
export class ItemListPage implements OnInit, OnDestroy {

  public isError: boolean;
  public allItems: Item[] = [];

  @LocalStorage()
  public sorting: 'alpha'|'element'|'type';

  public elementSortedItems: { [key: string]: Item[] } = {};
  public allElements: string[] = [];

  public alphaSortedItems: Item[] = [];

  public typeSortedItems: { [key: string]: Item[] } = {};
  public allItemTypes: string[] = [];

  public showSearch: boolean;
  public searchValue = '';

  private item$: Subscription;
  private hasModal: boolean;

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if(!this.sorting) { this.sorting = 'alpha'; }

    this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        this.updateItemsList();
      });

    this.item$ = this.dataService.items$.subscribe(items => {
      this.allItems = items;
      this.updateItemsList();
    });
  }

  ngOnDestroy() {
    this.item$.unsubscribe();
  }

  public convertWeaponType(type: string): string {
    if(type === 'all') { return 'Accessory'; }
    return this.dataService.properifyItem(type);
  }

  public loadItem(item: Item) {

    if(item.name === this.getPreviouslyLoadedItem()) {
      this.loadItemModal(item.name);
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.getCurrentFilter(),
        item: item.name
      }
    });
  }

  // UI MODIFYING FUNCTIONS
  public async loadItemModal(name: string) {
    if(this.hasModal) { return; }

    const item = _.find(this.allItems, { name });

    this.hasModal = true;

    const modal = await this.modalCtrl.create({
      component: ItemModal,
      componentProps: {
        item,
        type: this.convertWeaponType(item.subtype)
      }
    });

    modal.onDidDismiss().then(() => this.hasModal = false);

    await modal.present();
  }

  public async openSort(ev) {
    const popover = await this.popoverCtrl.create({
      component: ItemSortPopover,
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then(({ data }) => {
      if(!data) { return; }
      this.sorting = <'alpha'|'element'|'type'>data;
    });

    return await popover.present();
  }

  public toggleSearch() {
    this.showSearch = !this.showSearch;

    if(!this.showSearch) {
      this.closeSearch();
    }
  }

  public updateSearchValue(ev) {
    if(!ev.detail) {
      this.searchValue = '';
      return;
    }
    const str = ev.detail.data;
    this.searchValue = str;
  }

  public closeSearch() {
    this.showSearch = false;
    this.searchValue = '';
  }

  public weaponDesc(item: Item) {
    const arr = [];
    if(item.atk)      { arr.push(`${item.atk} ATK`); }
    if(item.int)      { arr.push(`${item.int} INT`); }
    if(item.element)  { arr.push(item.element); }

    return arr.join(' · ');
  }

  // ITEM LIST SORTING
  private updateItemsList() {
    let arr = this.allItems;

    const { type, subtype } = this.getCurrentFilter();
    if(type) {
      arr = this.allItems.filter(item => item.type === type);
    }

    if(subtype) {
      arr = this.allItems.filter(item => item.subtype === subtype);
    }

    if(arr.length === 0) {
      this.isError = true;
      return;
    }

    this.isError = false;

    // alpha sorting
    this.alphaSortedItems = _.sortBy(arr, 'name');

    // type sorting
    this.typeSortedItems = _(arr)
      .sortBy(arr, 'name')
      .groupBy('subtype')
      .value();
    this.allItemTypes = _.sortBy(Object.keys(this.typeSortedItems));

    // element sorting
    this.elementSortedItems = _(arr)
      .sortBy('name')
      .groupBy(item => item.element || 'None')
      .value();

    this.allElements = _.sortBy(Object.keys(this.elementSortedItems), el => {
      return el === 'None' ? 'Z' : el;
    });

    if(this.getPreviouslyLoadedItem()) {
      this.loadItemModal(this.getPreviouslyLoadedItem());
    }
  }

  private getCurrentFilter(): { type: string, subtype: string } {
    const parameters = new URLSearchParams(window.location.search);
    return { type: parameters.get('type'), subtype: parameters.get('subtype') };
  }

  private getPreviouslyLoadedItem(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('item');
  }
}

@Component({
  template: `
  <ion-content>
    <ion-list>
      <ion-list-header>Sort By</ion-list-header>
      <ion-item (click)="popoverCtrl.dismiss('alpha')"><ion-label>Item Name</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('element')"><ion-label>Item Element</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('type')"><ion-label>Item Type</ion-label></ion-item>
    </ion-list>
  </ion-content>
  `,
  styles: []
})
export class ItemSortPopover {
  constructor(public popoverCtrl: PopoverController) {}
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>{{ item.name }}</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="dismiss()">
          Close
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-row class="profile-row">
      <ion-col size-xs="6" size-md="3">
        <ion-img [src]="item.picture" class="picture"></ion-img>
      </ion-col>

      <ion-col>
        <p>{{ item.star }}★ {{ type }}</p>
        <p>
          <span *ngIf="item.atk" class="middot-after">{{ item.atk }} ATK</span>
          <span *ngIf="item.int">{{ item.int }} INT</span>
          <span *ngIf="item.def">{{ item.def }} DEF</span>
        </p>
        <p>Element: {{ item.element || 'None' }}</p>
      </ion-col>
    </ion-row>

    <ion-row class="tall-row">

      <ion-col class="tall-col">

        <ion-tabs #tabs>

          <ion-tab tab="factors">
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-card>
                    <ion-card-content>{{ item.factor1 }}</ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>
              <ion-row *ngIf="item.factor2">
                <ion-col>
                  <ion-card>
                    <ion-card-content>{{ item.factor2 }}</ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>
              <ion-row *ngIf="item.factor3">
                <ion-col>
                  <ion-card>
                    <ion-card-content>{{ item.factor3 }}</ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-tab>

          <ion-tab tab="notes">
            <div class="blank-slate" *ngIf="!item.notes">
              No notes have been entered for this item.
            </div>

            <ion-row>
              <ion-col class="notes" [innerHTML]="notes"></ion-col>
            </ion-row>
          </ion-tab>

          <ion-tab-bar slot="bottom">

            <ion-tab-button tab="notes">
              <ion-label>Item Evaluation</ion-label>
              <ion-icon name="paper"></ion-icon>
            </ion-tab-button>

            <ion-tab-button tab="factors">
              <ion-label>Factors</ion-label>
              <ion-icon name="bookmark"></ion-icon>
            </ion-tab-button>

          </ion-tab-bar>
        </ion-tabs>

      </ion-col>

    </ion-row>
  </ion-content>
  `,
  styles: [`
    .asset-icon {
      margin-left: 10px;
    }

    .picture {
      text-align: center;
      height: 128px;
      width: 128px;
    }

    .profile-row {
      border-bottom: 1px solid #000;
    }

    .tall-row {
      height: calc(100% - 139px);
    }

    .tall-col {
      height: 100%;
    }

    ion-tab.ion-page {
      overflow: auto;
    }

    .notes {
      white-space: pre-wrap;
    }

    .middot-after:after {
      content: ' · ';
    }
  `]
})
export class ItemModal implements OnInit {

  public item: Item;
  public type: string;
  public notes: string;

  @ViewChild('tabs')
  public tabs: Tabs;

  constructor(private navParams: NavParams, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.item = this.navParams.get('item');
    this.type = this.navParams.get('type');

    this.tabs.select('notes');

    this.notes = markdown.toHTML((this.item.notes || '').trim());
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
