import { filter } from 'rxjs/operators';
import { interval } from 'rxjs';

import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';

import { DataService } from './data.service';
import { LocalStorage } from 'ngx-webstorage';
import { SwUpdate } from '@angular/service-worker';

interface Page {
  title: string;
  url: string;
  icon?: string;
  queryParams?: any;
  visibleIf?: string;
  color?: string;
  assetIcon?: string;
  assetScale?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public _jpToggle: boolean;

  @LocalStorage()
  public isJP: boolean;

  public activePage: string;

  public appPages: Page[] = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }
  ];

  public a2hsPrompt: any;
  public canUpdate: boolean;

  constructor(
    private dataService: DataService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private statusBar: StatusBar,
    private router: Router,
    private updates: SwUpdate
  ) {
    this.initializeApp();
    this.loadRootData();
    this.watchRouteChanges();
    this.watchAppChanges();
  }

  public a2hs() {
    this.a2hsPrompt.prompt();
    this.a2hsPrompt = null;
  }

  public setRegion() {
    this.isJP = this._jpToggle;
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    window.onpopstate = async () => {
      try {
          const element = await this.modalCtrl.getTop();
          if(element) { element.dismiss(); }
      } catch (e) {}
    };

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.a2hsPrompt = e;
    });
  }

  private async loadRootData() {
    try {
      await this.dataService.loadRootData();
    } catch(e) {
      alert('Unable to load data, you may have to refresh or reload the app.');
    }

    this.loadClassData(this.dataService.classes);
    this.loadWeaponData(this.dataService.weaponTypes);
    this.loadAccessoryData(this.dataService.accessoryTypes);

    this.addAdditionalPages();
  }

  private loadClassData(classes) {
    this.appPages.push({
      title: 'Character List',
      url: '/characters',
      icon: 'person'
    });

    classes.forEach(({ id, name }) => {
      this.appPages.push({
          title: name,
          url: '/characters',
          queryParams: { filter: id },
          icon: '',
          assetIcon: `class-${id}`,
          assetScale: 0.25,
          visibleIf: '/characters',
          color: id
        });
    });
  }

  private loadWeaponData(weapons) {
    this.appPages.push({
      title: 'Weapon List',
      url: '/items',
      queryParams: { type: 'weapon' },
      icon: 'color-filter'
    });

    weapons.forEach(({ id, name }) => {
      this.appPages.push({
          title: name,
          url: '/items',
          queryParams: { type: 'weapon', subtype: id },
          assetIcon: `menu-${id}`,
          assetScale: 0.5,
          visibleIf: '/items',
        });
    });
  }

  private loadAccessoryData(accessories) {
    this.appPages.push({
      title: 'Accessory List',
      url: '/items',
      queryParams: { type: 'accessory' },
      icon: 'magnet'
    });

    accessories.forEach(({ name, id }) => {
      this.appPages.push({
          title: name,
          url: '/items',
          queryParams: { type: 'accessory' },
          assetIcon: `menu-${id}`,
          assetScale: 0.5,
          visibleIf: '/items',
        });
    });
  }

  private addAdditionalPages() {
    this.appPages.push({
      title: 'Party Creator',
      url: '/party-creator',
      icon: 'people'
    });

    this.appPages.push({
      title: 'Boss Guides',
      url: '/boss-guides',
      icon: 'paper'
    });
  }

  private watchRouteChanges() {
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        this.activePage = x.url.split('?')[0];
      });
  }

  private watchAppChanges() {
    if(!this.updates.isEnabled) { return; }

    interval(1000 * 60 * 15).subscribe(() => this.updates.checkForUpdate());
    this.updates.available.subscribe(() => {
      this.canUpdate = true;
    });

    this.updates.checkForUpdate();
  }

  public async doAppUpdate() {
    await this.updates.activateUpdate();
    document.location.reload();
  }
}
