
import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { LocalStorageService } from 'ngx-webstorage';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataService } from '../data.service';

import { Shop } from '../models/shop';
import { ShopModal } from './shops.ui';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})
export class ShopsPage implements OnInit, OnDestroy {

  public allShops: Shop[] = [];
  public region: string;

  private storage$: Subscription;
  private router$: Subscription;
  private shops$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.storage$ = this.localStorage.observe('isJP').subscribe(val => {
      this.updateRegionBasedOn(val);
      this.updateShopList();
    });

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!_.includes(x.url, 'shops')) { return; }
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.updateShopList();
      });

    this.shops$ = this.dataService.shops$.subscribe(shops => {
      this.allShops = shops;
      this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
      this.updateShopList();
    });
  }

  ngOnDestroy() {
    this.storage$.unsubscribe();
    this.router$.unsubscribe();
    this.shops$.unsubscribe();
  }

  private updateRegionBasedOn(val: boolean) {
    this.region = val ? 'jp' : 'gl';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        shop: this.getPreviouslyLoadedShop()
      }
    });
  }

  private updateShopList() {
    this.allShops = _(this.allShops).filter(x => x.cat === this.region).sortBy('name').value();

    if(this.getPreviouslyLoadedShop()) {
      this.loadShopModal(this.getPreviouslyLoadedShop());
    }
  }

  public loadShop(shop: Shop) {
    if(shop.name === this.getPreviouslyLoadedShop()) {
      this.loadShopModal(shop.name);
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        shop: shop.name
      }
    });
  }

  public async loadShopModal(name: string) {

    const shop = _.find(this.allShops, { name, cat: this.region });

    if(!shop) { return; }

    const modal = await this.modalCtrl.create({
      component: ShopModal,
      componentProps: {
        shop
      }
    });

    modal.onDidDismiss().then(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          region: this.region
        }
      });
    });

    await modal.present();
  }

  private getPreviouslyLoadedShop(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('shop');
  }

}
