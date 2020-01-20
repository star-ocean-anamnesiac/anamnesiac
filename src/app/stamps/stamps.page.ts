import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import * as _ from 'lodash';
import { filter } from 'rxjs/operators';

import { DataService } from '../data.service';

@Component({
  selector: 'app-stamps',
  templateUrl: './stamps.page.html',
  styleUrls: ['./stamps.page.scss'],
})
export class StampsPage implements OnInit, OnDestroy {

  public allStamps: any[] = [];
  public filteredStamps: any[] = [];
  private region: 'gl'|'jp';

  private router$: any;
  private stamp$: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { }

  async ngOnInit() {
    this.updateRegionBasedOn();
    this.updateStampList();

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!_.includes(x.url, 'items')) { return; }
        this.updateRegionBasedOn();
        this.updateStampList();
      });

      this.stamp$ = this.dataService.stamps$.subscribe(stamps => {
        this.allStamps = stamps;
        this.updateRegionBasedOn();
        this.updateStampList();
      });
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
    this.stamp$.unsubscribe();
  }

  private updateRegionBasedOn() {
    this.region = 'jp';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region
      }
    });
  }

  private updateStampList() {
    this.filteredStamps = this.allStamps.filter(x => x.cat === this.region);
  }

}
