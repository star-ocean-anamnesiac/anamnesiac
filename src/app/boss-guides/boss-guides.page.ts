
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataService } from '../data.service';
import { BossGuide } from '../models/bossguide';
import { ModalController } from '@ionic/angular';
import { BossGuideModal } from './boss-guides.ui';

@Component({
  selector: 'app-boss-guides',
  templateUrl: './boss-guides.page.html',
  styleUrls: ['./boss-guides.page.scss'],
})
export class BossGuidesPage implements OnInit {

  public allBosses: BossGuide[] = [];

  public region: string;

  private storage$: Subscription;
  private router$: Subscription;
  private bosses$: Subscription;

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
    });

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!_.includes(x.url, 'boss-guides')) { return; }
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.updateBossGuideList();
      });

    this.bosses$ = this.dataService.bossGuides$.subscribe(bosses => {
      this.allBosses = bosses;
      this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
      this.updateBossGuideList();
    });
  }

  ngOnDestroy() {
    this.storage$.unsubscribe();
    this.router$.unsubscribe();
    this.bosses$.unsubscribe();
  }

  private updateRegionBasedOn(val: boolean) {
    this.region = val ? 'jp' : 'gl';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        guide: this.getPreviouslyLoadedGuide()
      }
    });
  }

  private updateBossGuideList() {
    this.allBosses = _(this.allBosses).filter(x => x.cat === this.region).sortBy('name').value();

    if(this.getPreviouslyLoadedGuide()) {
      this.loadGuideModal(this.getPreviouslyLoadedGuide());
    }
  }

  public loadGuide(guide: BossGuide) {
    if(guide.name === this.getPreviouslyLoadedGuide()) {
      this.loadGuideModal(guide.name);
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        guide: guide.name
      }
    });
  }

  public async loadGuideModal(name: string) {

    const guide = _.find(this.allBosses, { name, cat: this.region });

    if(!guide) { return; }

    const modal = await this.modalCtrl.create({
      component: BossGuideModal,
      componentProps: {
        guide
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

  private getPreviouslyLoadedGuide(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('guide');
  }

}
