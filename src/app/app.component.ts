import { filter } from 'rxjs/operators';

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';

import { DataService } from './data.service';

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

  private async loadRootData() {
    try {
      await this.dataService.loadRootData();
    } catch(e) {
      alert('Unable to load data, you may have to refresh or reload the app.');
    }

    this.loadClassData(this.dataService.classes);
    this.loadWeaponData(this.dataService.weapons);
    this.loadAccessoryData(this.dataService.accessories);
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
      queryParams: { filter: 'weapon' },
      icon: 'color-filter'
    });

    weapons.forEach(({ id, name }) => {
      this.appPages.push({
          title: name,
          url: '/items',
          queryParams: { filter: 'weapon', subtype: id },
          icon: '',
          visibleIf: '/items',
        });
    });
  }

  private loadAccessoryData(weapons) {
    this.appPages.push({
      title: 'Accessory List',
      url: '/items',
      queryParams: { filter: 'accessory' },
      icon: 'magnet'
    });

    weapons.forEach(({ id, name }) => {
      this.appPages.push({
          title: name,
          url: '/items',
          queryParams: { filter: 'accessory' },
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
