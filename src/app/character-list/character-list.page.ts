
import * as _ from 'lodash';
import { filter } from 'rxjs/operators';
import { markdown } from 'markdown';

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { Character } from '../models/character';
import { Subscription } from 'rxjs';
import { ModalController, NavParams, Tabs } from '@ionic/angular';

@Component({
  selector: 'app-character-list',
  templateUrl: 'character-list.page.html',
  styleUrls: ['character-list.page.scss']
})
export class CharacterListPage implements OnInit, OnDestroy {

  public isError: boolean;
  public allCharacters: Character[] = [];

  public sortedCharacters: { [key: string]: Character[] } = {
    top: [],
    great: [],
    good: [],
    average: [],
    bad: []
  };

  private character$: Subscription;

  constructor(
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        this.updateCharacterList();
      });

    this.character$ = this.dataService.characters$.subscribe(chars => {
      this.allCharacters = chars;
      this.updateCharacterList();
    });
  }

  ngOnDestroy() {
    this.character$.unsubscribe();
  }

  public convertWeaponType(type: string): string {
    return this.dataService.properifyItem(type);
  }

  public loadCharacter(char: Character) {

    if(char.name === this.getPreviouslyLoadedChar()) {
      this.loadCharacterModal(char.name);
      return;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        filter: this.getCurrentFilter(),
        char: char.name
      }
    });
  }

  public async loadCharacterModal(name: string) {

    const character = _.find(this.allCharacters, { name });

    const modal = await this.modalCtrl.create({
      component: CharacterModal,
      componentProps: {
        character,
        weapon: this.convertWeaponType(character.weapon)
      }
    });

    return await modal.present();
  }

  private updateCharacterList() {
    let arr = this.allCharacters;

    const curFilter = this.getCurrentFilter();
    if(curFilter) {
      arr = this.allCharacters.filter(char => char.type === curFilter);
    }

    if(arr.length === 0) {
      this.isError = true;
      return;
    }

    this.isError = false;

    const grouped = _(arr)
      .sortBy([(char) => -char.rating, 'name'])
      .groupBy(char => {
        if(char.rating >= 10) { return 'top'; }
        if(char.rating >= 8 && char.rating <= 9) { return 'great'; }
        if(char.rating >= 6 && char.rating <= 7) { return 'good'; }
        if(char.rating >= 4 && char.rating <= 3) { return 'average'; }
        return 'bad';
      })
      .value();

    this.sortedCharacters.top = grouped.top || [];
    this.sortedCharacters.great = grouped.great || [];
    this.sortedCharacters.good = grouped.good || [];
    this.sortedCharacters.average = grouped.average || [];
    this.sortedCharacters.bad = grouped.bad || [];

    if(this.getPreviouslyLoadedChar()) {
      this.loadCharacterModal(this.getPreviouslyLoadedChar());
    }
  }

  private getCurrentFilter(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('filter');
  }

  private getPreviouslyLoadedChar(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('char');
  }
}

@Component({
  template: `
  <ion-header>
    <ion-toolbar [color]="char.type">
      <ion-img slot="start" [src]="'assets/classes/' + char.type + '.png'" class="asset-icon"></ion-img>
      <ion-title>{{ char.name }}</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="dismiss()">
          Close
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-row class="profile-row">
      <ion-col size="3">
        <ion-img [src]="char.picture" class="picture"></ion-img>
      </ion-col>

      <ion-col>
        <p>{{ char.star }}★ {{ char.ace ? 'ACE' : '' }} {{ char.limited ? '(Limited)' : '' }}</p>
        <p>Weapon: {{ weap }}<p>
      </ion-col>
    </ion-row>

    <ion-row class="tall-row">

      <ion-col class="tall-col">

        <ion-tabs #tabs>
          <ion-tab tab="stats">

            <ion-row>
              <ion-col>
                <ion-card>
                  <ion-card-header><ion-card-title>HP</ion-card-title></ion-card-header>
                  <ion-card-content>{{ char.stats.hp | number }}</ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col>
                <ion-card>
                  <ion-card-header><ion-card-title>HIT</ion-card-title></ion-card-header>
                  <ion-card-content>{{ char.stats.hit | number }}</ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <ion-card>
                  <ion-card-header><ion-card-title>ATK</ion-card-title></ion-card-header>
                  <ion-card-content>{{ char.stats.atk | number }}</ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col>
                <ion-card>
                  <ion-card-header><ion-card-title>INT</ion-card-title></ion-card-header>
                  <ion-card-content>{{ char.stats.int | number }}</ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <ion-card>
                  <ion-card-header><ion-card-title>DEF</ion-card-title></ion-card-header>
                  <ion-card-content>{{ char.stats.def | number }}</ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col>
                <ion-card>
                  <ion-card-header><ion-card-title>GRD</ion-card-title></ion-card-header>
                  <ion-card-content>{{ char.stats.grd | number }}</ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>

          </ion-tab>

          <ion-tab tab="talentskills">
            <ion-grid>
              <ion-row *ngFor="let talent of char.talents; let i = index">
                <ion-col>
                  <ion-card>
                    <ion-card-header><ion-card-title>Talent {{ i + 1 }}: {{ talent.name }}</ion-card-title></ion-card-header>
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

              <ion-row *ngFor="let skill of char.skills; let i = index">
                <ion-col>
                  <ion-card>
                    <ion-card-header>
                    <ion-card-title>Skill {{ i + 1 }}: {{ skill.name }} ({{ skill.ap }} AP)</ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                      <div *ngIf="skill.element"><strong>Element:</strong> {{ skill.element }}</div>
                      {{ skill.power }} <span *ngIf="skill.maxHits">({{ skill.maxHits }} hits)</span>
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
                      {{ char.rush.power }} <span *ngIf="char.rush.maxHits">({{ char.rush.maxHits }} hits)</span>
                      <ol>
                        <li *ngFor="let effect of char.rush.effects">
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

          <ion-tab tab="notes">
            <div class="blank-slate" *ngIf="!char.notes">
              No notes have been entered for this character.
            </div>

            <ion-row>
              <ion-col class="notes" [innerHTML]="notes"></ion-col>
            </ion-row>
          </ion-tab>

          <ion-tab-bar slot="bottom">

            <ion-tab-button tab="stats">
              <ion-label>Stats</ion-label>
              <ion-icon name="analytics"></ion-icon>
            </ion-tab-button>

            <ion-tab-button tab="talentskills">
              <ion-label>Talents/Skills/Rush</ion-label>
              <ion-icon name="bookmark"></ion-icon>
            </ion-tab-button>

            <ion-tab-button tab="notes">
              <ion-label>Notes</ion-label>
              <ion-icon name="paper"></ion-icon>
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
    }
  `]
})
export class CharacterModal implements OnInit {

  public char: Character;
  public weap: string;
  public notes: string;

  @ViewChild('tabs')
  public tabs: Tabs;

  constructor(private navParams: NavParams, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.char = this.navParams.get('character');
    this.weap = this.navParams.get('weapon');

    this.tabs.select('stats');

    this.notes = markdown.toHTML((this.char.notes || '').trim());
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
