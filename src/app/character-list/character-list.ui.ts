
import { markdown } from 'markdown';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, Tabs, NavParams, ModalController } from '@ionic/angular';
import { Character } from '../models/character';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  template: `
  <ion-content>
    <ion-list>
      <ion-list-header>Sort By</ion-list-header>
      <ion-item (click)="popoverCtrl.dismiss('alpha')"><ion-label>Character Name</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('weapon')"><ion-label>Character Weapon</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('tier')"><ion-label>Character Tier</ion-label></ion-item>
    </ion-list>
  </ion-content>
  `,
  styles: []
})
export class CharacterSortPopover {
  constructor(public popoverCtrl: PopoverController) {}
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar [color]="char.type">
      <ion-img slot="start" [src]="'assets/classes/' + char.type + '.png'" class="asset-icon"></ion-img>
      <ion-title>{{ char.name }}</ion-title>
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

    <ion-row class="profile-row">
      <ion-col size-xs="4" size-md="3">
        <ion-img [src]="'assets/characters/' + char.picture + '.png'" class="picture"></ion-img>
      </ion-col>

      <ion-col class="shrink-top-margin">
        <p>{{ char.star }}★ {{ char.ace ? 'ACE' : '' }} {{ char.limited ? '(Limited)' : '' }}</p>
        <p>Weapon: {{ weap }}<p>
      </ion-col>
    </ion-row>

    <ion-row class="tall-row">

      <ion-col class="tall-col">

        <ion-tabs #tabs>
          <ion-tab tab="stats" class="stats-tab">

            <ion-list>
              <ion-item *ngFor="let stat of ['hp', 'hit', 'atk', 'int', 'def', 'grd']">
                <strong>{{ stat.toUpperCase() }}</strong>: {{ char.stats[stat] | number }}
              </ion-item>
            </ion-list>

          </ion-tab>

          <ion-tab tab="talents">
            <ion-grid>
              <ion-row *ngFor="let talent of char.talents; let i = index">
                <ion-col>
                  <ion-card>
                    <ion-card-header><ion-card-title>{{ talent.name }}</ion-card-title></ion-card-header>
                    <ion-card-content>
                      <ol>
                        <li *ngFor="let effect of talent.effects">
                        {{ effect.desc }}
                        <span *ngIf="effect.all">(All {{ effect.all === true ? 'Allies' : effect.all }})</span>
                        <span *ngIf="effect.duration">({{ effect.duration }} seconds)</span>
                        </li>
                      </ol>
                    </ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-tab>

          <ion-tab tab="skillsrush">
            <ion-grid>

              <ion-row *ngFor="let skill of char.skills; let i = index">
                <ion-col>
                  <ion-card>
                    <ion-card-header>
                    <ion-card-title>
                      <ion-icon name="star" *ngIf="skill.highlight"></ion-icon>
                      {{ skill.name }} ({{ skill.ap }} AP)
                    </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <div *ngIf="skill.element"><strong>Element:</strong> {{ skill.element }}</div>
                      <div *ngIf="skill.power">
                        <strong>Power:</strong> {{ skill.power }} <span *ngIf="skill.maxHits">({{ skill.maxHits }} hits)</span>
                      </div>
                      <div *ngIf="skill.notes">{{ skill.notes }}</div>
                    </ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>

              <ion-row>
                <ion-col>
                  <ion-card>
                    <ion-card-header>
                      <ion-card-title>Rush: {{ char.rush.name }}</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <div *ngIf="char.rush.element"><strong>Element:</strong> {{ char.rush.element }}</div>
                      {{ char.rush.power }} <span *ngIf="char.rush.maxHits">({{ char.rush.maxHits }} Hits)</span>
                      <ol>
                        <li *ngFor="let effect of char.rush.effects">
                        {{ effect.desc }}
                        <span *ngIf="effect.all">
                          (All {{ effect.all === true ? 'Allies' : effect.all }}
                          <span *ngIf="effect.duration"> {{ effect.duration }}s</span>)
                        </span>
                        <span *ngIf="effect.duration"></span>
                        </li>
                      </ol>
                    </ion-card-content>
                  </ion-card>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-tab>

          <ion-tab tab="notes">
            <div class="blank-slate" *ngIf="!char.notes">
              No notes have been entered for this character.
            </div>

            <ion-row>
              <ion-col class="notes" [innerHTML]="notes"></ion-col>
            </ion-row>
          </ion-tab>

          <ion-tab-bar slot="bottom">

            <ion-tab-button tab="notes">
              <ion-label>Unit Evaluation</ion-label>
              <ion-icon name="paper"></ion-icon>
            </ion-tab-button>

            <ion-tab-button tab="stats">
              <ion-label>Stats</ion-label>
              <ion-icon name="analytics"></ion-icon>
            </ion-tab-button>

            <ion-tab-button tab="talents">
              <ion-label>Talents</ion-label>
              <ion-icon name="bookmark"></ion-icon>
            </ion-tab-button>

            <ion-tab-button tab="skillsrush">
              <ion-label>Skills/Rush</ion-label>
              <ion-icon name="flash"></ion-icon>
            </ion-tab-button>

          </ion-tab-bar>
        </ion-tabs>

      </ion-col>

    </ion-row>
  </ion-content>
  `,
  styles: [`
    .asset-icon {
      margin-left: 10px;
    }

    .picture {
      text-align: center;
      height: 128px;
      width: 128px;
    }

    .profile-row {
      border-bottom: 1px solid #000;
    }

    .tall-row {
      height: calc(100% - 139px);
    }

    .tall-col {
      height: 100%;
    }

    ion-tab.ion-page {
      overflow: auto;
    }

    .notes {
      white-space: pre-wrap;
      color: #fff;
    }

    p {
      color: #fff;
    }
  `]
})
export class CharacterModal implements OnInit {

  public char: Character;
  public weap: string;
  public notes: any;

  public showShare: boolean;

  @ViewChild('tabs')
  public tabs: Tabs;

  constructor(
    private domSanitizer: DomSanitizer,
    private navParams: NavParams, 
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.showShare = !!(<any>navigator).share;
    this.char = this.navParams.get('character');
    this.weap = this.navParams.get('weapon');

    this.tabs.select('notes');

    this.notes = this.domSanitizer.bypassSecurityTrustHtml(markdown
      .toHTML((this.char.notes || '')
      .trim())
      .split('<p>')
      .join('<p style="margin: 0">'));
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
      title: this.char.name,
      url: location.href
    });
  }
}
