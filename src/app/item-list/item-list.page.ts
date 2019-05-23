
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

import { ModalController, PopoverController } from '@ionic/angular';
import { Component, OnInit, OnDestroy, NgZone, ElementRef } from '@angular/core';
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
  public isLoading: boolean;
  public allItems: Item[] = [];

  @LocalStorage()
  public itemSorting: 'alpha'|'element'|'type'|'slayer'|'factor';

  @LocalStorage()
  public show1234: boolean;

  @LocalStorage()
  public gridView: boolean;

  public elementSortedItems: { [key: string]: Item[] } = {};
  public allElements: string[] = [];

  public slayerSortedItems: { [key: string]: Item[] } = {};
  public allSlayers: string[] = [];

  public alphaSortedItems: Item[] = [];

  public typeSortedItems: { [key: string]: Item[] } = {};
  public allItemTypes: string[] = [];

  public factorSortedItems: { [key: string]: Item[] } = {};
  public allFactors: string[] = [];

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
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    private elementRef: ElementRef
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
        this.updateItemListOutsideZone();
      });

    this.item$ = this.dataService.items$.subscribe(items => {
      setTimeout(() => {
        this.allItems = items;
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.updateItemListOutsideZone();
      }, 1000);
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

  private updateItemListOutsideZone() {
    this.isLoading = this.allItems.length === 0;

    this.ngZone.runOutsideAngular(() => {
      const res = this.getItemList();

      this.ngZone.run(() => {

        if(!_.isUndefined(res.isError)) {
          this.isError = res.isError;
          if(this.isError) { return; }
        }

        this.alphaSortedItems = res.alphaSortedItems;

        this.allElements = res.allElements;
        this.allItemTypes = res.allItemTypes;
        this.allSlayers = res.allSlayers;
        this.allFactors = res.allFactors;

        this.elementSortedItems = res.elementSortedItems;
        this.typeSortedItems = res.typeSortedItems;
        this.slayerSortedItems = res.slayerSortedItems;
        this.factorSortedItems = res.factorSortedItems;

        if(this.getPreviouslyLoadedItem()) {
          this.loadItemModal(this.getPreviouslyLoadedItem());
        }

        setTimeout(() => {
          this.isLoading = false;
        });
      });
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
      if(data === 'show1234') {
        this.show1234 = !this.show1234;
        this.updateItemListOutsideZone();
        return;
      }
      this.itemSorting = <'alpha'|'element'|'type'|'slayer'|'factor'>data;
      this.updateItemListOutsideZone();
    });

    return await popover.present();
  }

  public toggleSearch() {
    this.showSearch = !this.showSearch;

    if(!this.showSearch) {
      this.closeSearch();
    } else {
      setTimeout(() => {
        this.elementRef.nativeElement.querySelector('input').focus();
      }, 500);
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
  private getItemList() {
    let arr = this.allItems;

    if(!this.show1234) {
      arr = arr.filter(x => x.star >= 5);
    }

    const { type, subtype } = this.getCurrentFilter();
    this.isFiltered = !!subtype;
    if(type) {
      arr = arr.filter(item => item.type === type);
    }

    if(subtype) {
      arr = arr.filter(item => item.subtype === subtype);
    }

    arr = arr.filter(item => item.cat === this.region);

    if(arr.length === 0) {
      return { isError: true };
    }

    // alpha sorting
    let alphaSortedItems = [];

    if(this.itemSorting === 'alpha') {
      alphaSortedItems = _.sortBy(arr, 'name');
    }

    // type sorting
    let typeSortedItems = {};
    let allItemTypes = [];

    if(this.itemSorting === 'type') {
      typeSortedItems = _(arr)
        .sortBy('name')
        .groupBy('subtype')
        .value();

      allItemTypes = _.sortBy(Object.keys(typeSortedItems));
    }

    // element sorting
    let allElements = [];
    const elementSortedItems = {};

    if(this.itemSorting === 'element') {
      allElements = _(arr)
        .map(i => i.factors.map(x => x.element))
        .flattenDeep()
        .compact()
        .uniq()
        .sortBy()
        .tap(innerArr => {
          innerArr.push('None');
        })
        .value();

      _(arr)
        .sortBy('name')
        .forEach(item => {
          const allFoundElements = item.factors.map(x => x.element || 'None');
          _.uniq(allFoundElements).forEach(el => {
            elementSortedItems[el] = elementSortedItems[el] || [];
            elementSortedItems[el].push(item);
          });
        });
    }

    // slayer sorting
    let allSlayers = [];
    const slayerSortedItems = {};

    if(this.itemSorting === 'slayer') {
      allSlayers = _(arr)
        .map(i => i.factors.map(x => x.slayer))
        .flattenDeep()
        .compact()
        .uniq()
        .sortBy()
        .tap(innerArr => {
          innerArr.push('None');
        })
        .value();

      _(arr)
        .sortBy('name')
        .forEach(item => {
          const allFoundSlayers = item.factors.map(x => x.slayer || 'None');
          _.uniq(allFoundSlayers).forEach(el => {
            slayerSortedItems[el] = slayerSortedItems[el] || [];
            slayerSortedItems[el].push(item);
          });
        });
    }

    // factor sorting
    let allFactors = [];
    const factorSortedItems = {};

    if(this.itemSorting === 'factor') {
      allFactors = _(arr)
        .map(i => i.factors.map(x => x.meta ? x.meta.buff : ''))
        .flattenDeep()
        .compact()
        .uniq()
        .sortBy()
        .value();

      _(arr)
        .sortBy('name')
        .forEach(item => {
          const allFoundFactors = _.compact(item.factors.map(x => x.meta ? x.meta.buff : ''));
          _.uniq(allFoundFactors).forEach(el => {
            factorSortedItems[el] = factorSortedItems[el] || [];
            factorSortedItems[el].push(item);
          });
        });
    }

    return {
      isError: false,
      alphaSortedItems,
      allItemTypes,
      allElements,
      allSlayers,
      typeSortedItems,
      slayerSortedItems,
      elementSortedItems,
      allFactors,
      factorSortedItems
    };
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
