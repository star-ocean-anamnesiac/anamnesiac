
import { markdown } from 'markdown';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { BossGuide } from '../models/bossguide';
import { Shop } from '../models/shop';

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <app-appicon slot="start" [name]="'shop-' + shop.icon" [scaleX]="1" [scaleY]="1"></app-appicon>

      <ion-title>
        {{ shop.name }}
      </ion-title>
      <ion-buttons slot="end">
        <ion-button icon-only (click)="share()" *ngIf="showShare">
          <ion-icon name="share"></ion-icon>
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

    <ion-list>
      <ion-list-header>Shop Information</ion-list-header>

      <ion-item>
        <app-appicon slot="start" [name]="'shop-' + shop.icon" [scaleX]="0.5" [scaleY]="0.5"></app-appicon>
        {{ shop.items.length }} total items costing {{ totalCost.toLocaleString() }} total {{ shop.currency }}
      </ion-item>

      <ion-list-header>Shop Items</ion-list-header>

      <ion-item *ngFor="let item of shop.items">
        <app-appicon slot="start" [name]="shopIcon(item.type)"
                     [scaleX]="shopScale(item.type)" [scaleY]="shopScale(item.type)"></app-appicon>

        <ion-label>
          <h2>{{ item.name }}</h2>
          <p>Cost: {{ item.cost.toLocaleString() }} (x{{ item.stock || '∞' }})</p>
        </ion-label>
      </ion-item>
    </ion-list>

  </ion-content>
  `,
  styles: [`
    app-appicon {
      margin-right: 8px;
      padding-top: 2px;
    }

    p {
      color: #fff;
    }
  `]
})
export class ShopModal implements OnInit {

  public shop: Shop;
  public get totalCost(): number {
    return this.shop.items.reduce((prev, cur) => {
      if(!cur.stock) { return prev; }

      return prev + (cur.stock * cur.cost);
    }, 0);
  }

  public showShare: boolean;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.showShare = !!(<any>navigator).share;
    this.shop = this.navParams.get('shop');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  share() {
    if(!(<any>navigator).share) {
      alert('You cannot share at this time, sorry.');
      return;
    }

    (<any>navigator).share({
      title: this.shop.name,
      url: location.href
    });
  }

  shopIcon(name: string) {
    if(!name.includes('-')) {
      return `menu-${name === 'accessory' ? 'all' :  name}`;
    }

    return `shop-${name}`;
  }

  shopScale(name: string) {
    if(!name.includes('-')) {
      return 0.5;
    }

    return 1;
  }
}
