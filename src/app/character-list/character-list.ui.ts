
import { markdown } from 'markdown';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, Tabs, NavParams, ModalController } from '@ionic/angular';
import { Character } from '../models/character';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorage } from 'ngx-webstorage';


@Component({
  template: `
  <ion-content>
    <ion-list>
      <ion-list-header>Sort By</ion-list-header>
      <ion-item (click)="popoverCtrl.dismiss('alpha')"><ion-label>Character Name</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('weapon')"><ion-label>Character Weapon</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('tier')"><ion-label>Character Tier</ion-label></ion-item>
      <ion-item (click)="popoverCtrl.dismiss('show34')">
        <ion-label>Show 3*/4*</ion-label>
        <ion-checkbox [checked]="show34"></ion-checkbox>
      </ion-item>
      <ion-item (click)="popoverCtrl.dismiss('hideAce')">
        <ion-label>Show ACE</ion-label>
        <ion-checkbox [checked]="!hideAce"></ion-checkbox>
      </ion-item>
      <ion-item (click)="popoverCtrl.dismiss('hideLimited')">
        <ion-label>Show Limited</ion-label>
        <ion-checkbox [checked]="!hideLimited"></ion-checkbox>
      </ion-item>
      <ion-item (click)="popoverCtrl.dismiss('hideSemi')">
        <ion-label>Show Semi-Limited</ion-label>
        <ion-checkbox [checked]="!hideSemi"></ion-checkbox>
      </ion-item>
    </ion-list>
  </ion-content>
  `,
  styles: []
})
export class CharacterSortPopover {

  @LocalStorage()
  public show34: boolean;

  @LocalStorage()
  public hideAce: boolean;

  @LocalStorage()
  public hideLimited: boolean;

  @LocalStorage()
  public hideSemi: boolean;

  constructor(public popoverCtrl: PopoverController) {}
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar [color]="char.type">
      <span slot="start" class="titlebar-class-chunk">
        <app-appicon [name]="'class-' + char.type" [scaleX]="0.25" [scaleY]="0.25"></app-appicon>
      </span>
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
      <ion-col size-xs="5" size-md="3" size-lg="3" position-relative text-center>

        <app-lazy-img class="big-icon" [src]="'assets/characters/' + char.picture + '.png'" [alt]="char.name"></app-lazy-img>

        <span class="awakened-container" *ngIf="char.awakened">
          <app-appicon [name]="char.awakened === true ? 'misc-awakening' : 'misc-awakening-9'" [scaleX]="1" [scaleY]="1"></app-appicon>
        </span>
      </ion-col>

      <ion-col class="shrink-top-margin">
        <p class="vertical-center">
          <app-appicon [name]="'char-' + char.star" [scaleX]="0.5" [scaleY]="0.5" [inline]="true"></app-appicon>
          <span>{{ char.ace ? 'ACE' : '' }} {{ char.limited ? (char.semi ? 'Semi-Limited' : 'Limited') : '' }}</span>
        </p>
        <p>
          <app-weapon [weapon]="char.weapon"></app-weapon>
        <p>
      </ion-col>
    </ion-row>

    <ion-row class="tall-row">

      <ion-col class="tall-col">

        <ion-tabs #tabs>
          <ion-tab tab="stats" class="stats-tab">

            <ion-list>
              <ion-item *ngFor="let stat of ['hp', 'atk', 'int', 'def', 'hit', 'grd', 'ap']">
                <app-appicon slot="start" [name]="'seed-' + stat" [scaleX]="0.25" [scaleY]="0.25"></app-appicon>
                <strong>{{ stat.toUpperCase() }}</strong>: {{ (char.stats[stat] || 100) | number }}
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
                      <ol *ngIf="talent.shortEffects">
                        <li>{{ talent.shortEffects }}</li>
                      </ol>
                      <ol *ngIf="!talent.shortEffects">
                        <li *ngFor="let effect of talent.effects">
                        {{ effect.desc }}
                        <span *ngIf="effect.all">({{ effect.all === true ? 'Party' : effect.all }})</span>
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
                        <app-appicon *ngIf="skill.highlight"
                                   [name]="'misc-highlight'"
                                   [scaleX]="0.25"
                                   [scaleY]="0.25"
                                   [inline]="true"></app-appicon>
                        {{ skill.name }}
                      </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <ion-row>
                        <ion-col size="3" no-padding class="true-center">
                          <div class="s64x64">

                            <app-lazy-img class="list-icon"
                                          [src]="'assets/skills/' + skill.picture + '.png'"
                                          [alt]="skill.name"></app-lazy-img>

                            <app-appicon [name]="'el-' + skill.element.toLowerCase()"
                                         *ngIf="skill.element"
                                         [forceWidth]="24"
                                         [forceHeight]="24"
                                         class="element-icon"></app-appicon>
                          </div>
                        </ion-col>

                        <ion-col>
                          <div>
                            <strong>AP Cost:</strong>
                            {{ skill.ap }}
                          </div>
                          <div *ngIf="skill.power">
                            <strong>Power:</strong> {{ skill.power }} <span *ngIf="skill.maxHits">({{ skill.maxHits }} hits)</span>
                          </div>
                          <div *ngIf="skill.notes">{{ skill.notes }}</div>
                        </ion-col>
                      </ion-row>
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

                      <ion-row>
                        <ion-col size="3" no-padding class="true-center">
                          <div class="s64x64">

                            <app-lazy-img class="list-icon"
                                          [src]="'assets/rush/' + char.rush.picture + '.png'"
                                          [alt]="char.rush.name"></app-lazy-img>
                            <app-appicon [name]="'el-' + char.rush.element.toLowerCase()"
                                         *ngIf="char.rush.element"
                                         [forceWidth]="24"
                                         [forceHeight]="24"
                                         class="element-icon"></app-appicon>
                          </div>
                        </ion-col>

                        <ion-col>
                          {{ char.rush.power }} <span *ngIf="char.rush.maxHits">({{ char.rush.maxHits }} Hits)</span>
                          <ol>
                            <li *ngFor="let effect of char.rush.effects">
                              {{ effect.desc }}
                              <span *ngIf="effect.duration">
                                <span *ngIf="effect.all">({{ effect.all === true ? 'Party' : effect.all }}</span>
                                <span *ngIf="!effect.all">(Self</span>
                                /{{ effect.duration }}s)
                              </span>
                            </li>
                          </ol>
                        </ion-col>
                      </ion-row>
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
      margin-bottom: -5px;
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
    }

    .notes, p {
      color: #fff;
      text-shadow:
       -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
         1px 1px 0 #000;
    }

    .element-icon {
      position: absolute;
      right: 0;
      bottom: 0;
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
      .join('<p style="margin: 0">')
      .replace(/\s\s+/g, ' '));
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
