
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

import { ModalController, PopoverController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { Item } from '../models/item';
import { ItemModal, ItemSortPopover } from './item-list.ui';

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.page.html',
  styleUrls: ['item-list.page.scss']
})
export class ItemListPage implements OnInit, OnDestroy {

  public isFiltered: boolean;

  public isError: boolean;
  public allItems: Item[] = [];

  @LocalStorage()
  public itemSorting: 'alpha'|'element'|'type'|'slayer';

  public elementSortedItems: { [key: string]: Item[] } = {};
  public allElements: string[] = [];

  public slayerSortedItems: { [key: string]: Item[] } = {};
  public allSlayers: string[] = [];

  public alphaSortedItems: Item[] = [];

  public typeSortedItems: { [key: string]: Item[] } = {};
  public allItemTypes: string[] = [];

  public showSearch: boolean;
  public searchValue = '';

  private storage$: Subscription;
  private router$: Subscription;
  private item$: Subscription;
  private hasModal: boolean;

  private region: 'gl'|'jp';

  constructor(
    private dataService: DataService,
    private localStorage: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if(!this.itemSorting) { this.itemSorting = 'alpha'; }

    this.storage$ = this.localStorage.observe('isJP').subscribe(val => {
      this.updateRegionBasedOn(val);
    });

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!_.includes(x.url, 'items')) { return; }
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.updateItemsList();
      });

    this.item$ = this.dataService.items$.subscribe(items => {
      this.allItems = items;
      this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
      this.updateItemsList();
    });
  }

  ngOnDestroy() {
    this.storage$.unsubscribe();
    this.router$.unsubscribe();
    this.item$.unsubscribe();
  }

  private updateRegionBasedOn(val: boolean) {
    this.region = val ? 'jp' : 'gl';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.getCurrentFilter(),
        region: this.region,
        item: this.getPreviouslyLoadedItem()
      }
    });
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
        region: this.region,
        item: item.name
      }
    });
  }

  // UI MODIFYING FUNCTIONS
  public async loadItemModal(name: string) {
    if(this.hasModal) { return; }

    const item = _.find(this.allItems, { name, cat: this.region });

    if(!item) { return; }

    this.hasModal = true;

    const modal = await this.modalCtrl.create({
      component: ItemModal,
      componentProps: {
        item,
        type: this.convertWeaponType(item.subtype)
      }
    });

    modal.onDidDismiss().then(() => {
      this.hasModal = false;

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          ...this.getCurrentFilter(),
          region: this.region
        }
      });
    });

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
      this.itemSorting = <'alpha'|'element'|'type'>data;
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
    const str = ev.target.value;
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

    return arr.join(' · ');
  }

  // ITEM LIST SORTING
  private updateItemsList() {
    let arr = this.allItems;

    const { type, subtype } = this.getCurrentFilter();
    this.isFiltered = !!subtype;
    if(type) {
      arr = this.allItems.filter(item => item.type === type);
    }

    if(subtype) {
      arr = this.allItems.filter(item => item.subtype === subtype);
    }

    arr = arr.filter(item => item.cat === this.region);

    if(arr.length === 0) {
      this.isError = true;
      return;
    }

    this.isError = false;

    // alpha sorting
    this.alphaSortedItems = _.sortBy(arr, 'name');

    // type sorting
    this.typeSortedItems = _(arr)
      .sortBy('name')
      .groupBy('subtype')
      .value();
    this.allItemTypes = _.sortBy(Object.keys(this.typeSortedItems));

    this.allElements = _(arr)
      .map(i => i.factors.map(x => x.element))
      .flattenDeep()
      .compact()
      .uniq()
      .sortBy()
      .tap(innerArr => {
        innerArr.push('None');
      })
      .value();

    // element sorting
    this.elementSortedItems = {};

    _(arr)
      .sortBy('name')
      .forEach(item => {
        const allElements = item.factors.map(x => x.element || 'None');
        _.uniq(allElements).forEach(el => {
          this.elementSortedItems[el] = this.elementSortedItems[el] || [];
          this.elementSortedItems[el].push(item);
        });
      });

    // slayer sorting
    this.allSlayers = _(arr)
      .map(i => i.factors.map(x => x.slayer))
      .flattenDeep()
      .compact()
      .uniq()
      .sortBy()
      .tap(innerArr => {
        innerArr.push('None');
      })
      .value();

    this.slayerSortedItems = {};

    _(arr)
      .sortBy('name')
      .forEach(item => {
        const allSlayers = item.factors.map(x => x.slayer || 'None');
        _.uniq(allSlayers).forEach(el => {
          this.slayerSortedItems[el] = this.slayerSortedItems[el] || [];
          this.slayerSortedItems[el].push(item);
        });
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
