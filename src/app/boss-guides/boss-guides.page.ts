
import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class BossGuidesPage implements OnInit, OnDestroy {

  public allBosses: BossGuide[] = [];

  public region: string;

  private router$: Subscription;
  private bosses$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.updateRegionBasedOn();
    this.updateBossGuideList();

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!_.includes(x.url, 'boss-guides')) { return; }
        this.updateRegionBasedOn();
        this.updateBossGuideList();
      });

    this.bosses$ = this.dataService.bossGuides$.subscribe(bosses => {
      this.allBosses = bosses;
      console.log(bosses);
      this.updateRegionBasedOn();
      this.updateBossGuideList();
    });
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
    this.bosses$.unsubscribe();
  }

  private updateRegionBasedOn() {
    this.region = 'jp';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        guide: this.getPreviouslyLoadedGuide()
      }
    });
  }

  private updateBossGuideList() {
    this.allBosses = _(this.allBosses).sortBy('name').value();

    if(this.getPreviouslyLoadedGuide()) {
      this.loadGuideModal(this.getPreviouslyLoadedGuide());
    }
  }

  public loadGuide(guide: BossGuide) {
    console.log(guide.name, this.getPreviouslyLoadedGuide())
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
    console.log(guide);

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
