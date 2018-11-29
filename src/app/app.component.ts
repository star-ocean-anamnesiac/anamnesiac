import { filter } from 'rxjs/operators';

import { Component, ViewChild, HostListener } from '@angular/core';

import { Platform, ModalController, Toggle } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';

import { DataService } from './data.service';
import { LocalStorage } from 'ngx-webstorage';

interface Page {
  title: string;
  url: string;
  icon?: string;
  queryParams?: any;
  visibleIf?: string;
  color?: string;
  assetIcon?: string;
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

  constructor(
    private dataService: DataService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
    this.loadRootData();
    this.watchRouteChanges();
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

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.a2hsPrompt = e;
    });
  }
  
  @HostListener('document:ionBackButton', ['$event'])
  async watchBackButton() {
    try {
        const element = await this.modalCtrl.getTop();
        if(element) { element.dismiss(); }
    } catch (e) {}
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
          assetIcon: `classes/${id}`,
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
          icon: '',
          visibleIf: '/items',
        });
    });
  }

  private loadAccessoryData(weapons) {
    this.appPages.push({
      title: 'Accessory List',
      url: '/items',
      queryParams: { type: 'accessory' },
      icon: 'magnet'
    });

    weapons.forEach(({ name }) => {
      this.appPages.push({
          title: name,
          url: '/items',
          queryParams: { type: 'accessory' },
          icon: '',
          visibleIf: '/items',
        });
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
}
