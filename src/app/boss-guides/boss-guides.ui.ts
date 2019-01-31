
import { markdown } from 'markdown';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { BossGuide } from '../models/bossguide';
/*
              <ion-col class="notes" [innerHTML]="notes"></ion-col>
              */
@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <span slot="start" class="titlebar-class-chunk">
        <app-appicon [name]="'boss-' + guide.image" [scaleX]="0.125" [scaleY]="0.125" [inline]="true"></app-appicon>
      </span>
      <ion-title>
        {{ guide.name }}
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

      <ion-item-divider><strong>Boss Info</strong></ion-item-divider>

      <ion-item>
        <ion-row class="item-row">
          <ion-col size-xs="6" size-sm="4">
            <ion-label><strong>Type</strong></ion-label>
          </ion-col>

          <ion-col size-xs="6" size-sm="8" class="vertical-center">
            <ul class="boss-list has-bullets">
              <li class="list-appicon">
                <app-appicon class="margin-right"
                            [name]="'type-' + guide.race.toLowerCase()"
                            [scaleX]="0.25"
                            [scaleY]="0.25"></app-appicon> {{ guide.race }}
              </li>
            </ul>
          </ion-col>
        </ion-row>
      </ion-item>

      <ion-item>
        <ion-row class="item-row">
          <ion-col size-xs="6" size-sm="4">
            <ion-label><strong>Inflicts</strong></ion-label>
          </ion-col>

          <ion-col size-xs="6" size-sm="8" class="vertical-center">
            <ul class="boss-list has-bullets">
              <li class="list-appicon none" *ngIf="!guide.statusInflictions || guide.statusInflictions.length === 0">None</li>
              <li class="list-appicon" *ngFor="let inflict of guide.statusInflictions">
                <app-appicon class="margin-right"
                            [name]="'debuff-' + inflict.toLowerCase()"
                            [scaleX]="0.25"
                            [scaleY]="0.25"></app-appicon> {{ inflict }}
              </li>
            </ul>
          </ion-col>
        </ion-row>
      </ion-item>

      <ion-item>
        <ion-row class="item-row">
          <ion-col size-xs="6" size-sm="4">
            <ion-label><strong>Weaknesses</strong></ion-label>
          </ion-col>

          <ion-col size-xs="6" size-sm="8" class="vertical-center">
            <ul class="boss-list has-bullets">
              <li class="list-appicon none" *ngIf="!guide.weaknesses || guide.weaknesses.length === 0">None</li>
              <li class="list-appicon" *ngFor="let weakness of guide.weaknesses">
                <ng-container *ngIf="weakness.plain">
                  {{ weakness.plain }} {{ weakness.percentWeakness }}%
                </ng-container>

                <ng-container *ngIf="weakness.element">
                  <app-appicon [name]="'el-' + weakness.element.toLowerCase()"
                              [scaleX]="0.25"
                              [scaleY]="0.25"></app-appicon> {{ weakness.element }} {{ weakness.percentWeakness }}%
                </ng-container>

                <ng-container *ngIf="weakness.status">
                  <app-appicon [name]="'debuff-' + weakness.status.toLowerCase()"
                              [scaleX]="0.25"
                              [scaleY]="0.25"></app-appicon> {{ weakness.status }}
                </ng-container>
              </li>
            </ul>
          </ion-col>
        </ion-row>
      </ion-item>

      <ion-item>
        <ion-row class="item-row">
          <ion-col size-xs="6" size-sm="4">
            <ion-label><strong>Recommendations</strong></ion-label>
          </ion-col>

          <ion-col size-xs="6" size-sm="8" class="vertical-center">
            <ul class="boss-list">
              <li class="list-appicon none" *ngIf="!guide.recommendations || guide.recommendations.length === 0">None</li>
              <li class="list-appicon" *ngFor="let recommend of guide.recommendations">
                <ng-container *ngIf="recommend.plain">
                  {{ recommend.plain }}
                </ng-container>
              </li>
            </ul>
          </ion-col>
        </ion-row>
      </ion-item>

      <ion-item>
        <ion-label><strong>Enrage</strong></ion-label>

        <div class="vertical-center">
          <app-appicon [name]="'misery-m1'"
                       class="misery"
                       [scaleX]="0.375"
                       [scaleY]="0.375"></app-appicon> {{ guide.enrage.m1 }}

          <app-appicon [name]="'misery-m2'"
                       class="misery"
                       [scaleX]="0.375"
                       [scaleY]="0.375"></app-appicon> {{ guide.enrage.m2 }}

          <app-appicon [name]="'misery-m3'"
                       class="misery"
                       [scaleX]="0.375"
                       [scaleY]="0.375"></app-appicon> {{ guide.enrage.m3 }}
        </div>
      </ion-item>

      <ion-item-divider><strong>Boss Skills</strong></ion-item-divider>

      <ion-item *ngFor="let move of guide.moves; let i = index" text-wrap>
        <ion-label>
          <h2>

            <ng-container *ngFor="let mis of [3, 2, 1]">
              <app-appicon [name]="'misery-m' + mis"
                          *ngIf="move['m' + mis]"
                          float-right
                          [scaleX]="0.375"
                          [scaleY]="0.375"></app-appicon>
            </ng-container>

            <strong>{{ move.name }}</strong>

            <br>

            <small>
              <em>
                Targets: {{ move.targets }}

                <strong *ngIf="move.isEnrage">Enrage</strong>
              </em>
            </small>
          </h2>
          <div text-wrap [innerHTML]="moveTexts[i]"></div>
        </ion-label>

      </ion-item>

      <ion-item-divider><strong>Boss Description</strong></ion-item-divider>

      <ion-item><div padding [innerHTML]="descText"></div></ion-item>

    </ion-list>

  </ion-content>
  `,
  styles: [`
    .boss-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .boss-list.has-bullets {
      list-style-type: none;
    }

    ion-tab.ion-page {
      overflow: auto;
    }

    .notes {
      white-space: pre-wrap;
    }

    .notes, p {
      color: #fff;
      text-shadow:
       -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
         1px 1px 0 #000;
    }

    .item-row {
      width: 100%;
    }

    .list-appicon {
      margin-bottom: 8px;
      min-width: 115px;
      margin-right: 15px;
    }

    app-appicon {
      margin-right: 8px;
      padding-top: 2px;
    }

    app-appicon.misery {
      margin-left: 8px;
    }

    .none {
      padding-left: 28px;
    }

    small em strong {
      padding-left: 10px;
    }
  `]
})
export class BossGuideModal implements OnInit {

  public guide: BossGuide;

  public showShare: boolean;

  public descText: any;
  public moveTexts: any[] = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.showShare = !!(<any>navigator).share;
    this.guide = this.navParams.get('guide');

    this.descText = this.domSanitizer.bypassSecurityTrustHtml(
        markdown.toHTML(
          (this.guide.desc || '').trim()
            .split('\n').join('\n\n')
        )
      .split('<p>')
      .join('<p style="margin: 0;margin-bottom: 20px;">')
    );

    this.moveTexts = this.guide.moves.map(({ desc }) => {
      return this.domSanitizer.bypassSecurityTrustHtml(
        markdown.toHTML(
          (desc || '').trim()
            .split('\n').join('\n\n')
        )
        .split('<p>')
        .join('<p style="margin: 0;margin-bottom: 20px;">')
      );
    });
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
      title: this.guide.name,
      url: location.href
    });
  }
}
