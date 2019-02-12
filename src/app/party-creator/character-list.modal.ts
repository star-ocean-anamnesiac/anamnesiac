
import { includes, sortBy } from 'lodash';

import { Component, OnInit, ElementRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Character } from '../models/character';

@Component({
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Choose Party Character</ion-title>
      <ion-buttons slot="end">
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

    <ion-searchbar showCancelButton
                   (ionCancel)="closeSearch()"
                   (ionInput)="updateSearchValue($event)"
    ></ion-searchbar>

    <div class="blank-slate" *ngIf="filteredCharacters.length === 0">
      There are no characters for this region.
    </div>

    <ion-row *ngIf="filteredCharacters.length > 0">
      <ion-col text-center>
        <ion-segment class="segment-spacing">
          <ion-button *ngFor="let charClass of ['attacker', 'defender', 'healer', 'invoker', 'sharpshooter']"
                              class="role-button"
                              (click)="setRoleFilter(charClass)"
                              [color]="roleFilter
                                && roleFilter === charClass
                                  ? charClass
                                  : (roleFilter ? 'medium' : charClass)">
            <app-appicon [name]="'class-' + charClass" [scaleX]="0.25" [scaleY]="0.25"></app-appicon>
          </ion-button>
        </ion-segment>
      </ion-col>
    </ion-row>

    <ion-list *ngIf="filteredCharacters.length > 0">
      <ion-item (click)="selectChar(null)">
        Clear this character slot
      </ion-item>

      <ion-item *ngFor="let char of filteredCharacters" (click)="selectChar(char)">

        <span slot="start" class="picture-class-chunk">
          <app-appicon [name]="char.picture" [forceWidth]="64" [forceHeight]="64" type="char"></app-appicon>
          <app-appicon margin-horizontal class="hidden-xs" [name]="'class-' + char.type" [scaleX]="0.25" [scaleY]="0.25"></app-appicon>
        </span>

        <ion-label>
          <h2 class="vertical-center">
            <app-appicon [name]="'char-' + char.star" [scaleX]="0.5" [scaleY]="0.5" [inline]="true"></app-appicon>
            <span class="awakened-container" *ngIf="char.awakened">
              <app-appicon [name]="'misc-awakening'" [scaleX]="0.5" [scaleY]="0.5"></app-appicon>
            </span>
            <span>{{ char.name }}</span>
          </h2>
        </ion-label>
      </ion-item>
    </ion-list>

  </ion-content>
  `,
  styles: [`
    .awakened-container {
      margin-left: 16px;
    }

    .segment-spacing {
      justify-content: space-evenly;
    }
  `]
})
export class CharacterListModal implements OnInit {

  public characters: Character[] = [];
  public filteredCharacters: Character[] = [];

  public roleFilter: string;

  public searchValue: string;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.characters = this.navParams.get('characters');
    this.updateFilteredCharacters();

    setTimeout(() => {
      this.elementRef.nativeElement.querySelector('input').focus();
    }, 500);
  }

  setRoleFilter(charClass: string) {
    if(this.roleFilter === charClass) {
      this.roleFilter = '';
      this.updateFilteredCharacters();
      return;
    }

    this.roleFilter = charClass;
    this.updateFilteredCharacters();
  }

  updateSearchValue(ev) {
    if(!ev.detail) {
      this.searchValue = '';
      return;
    }
    const str = ev.target.value;
    this.searchValue = str;

    this.updateFilteredCharacters();
  }

  closeSearch() {
    this.searchValue = '';
    this.updateFilteredCharacters();
  }

  private updateFilteredCharacters() {
    let sortedChars = sortBy(this.characters, 'name');

    if(this.searchValue) {
      sortedChars = sortedChars.filter(x => includes(x.name.toLowerCase(), this.searchValue.toLowerCase()));
    }

    if(this.roleFilter) {
      sortedChars = sortedChars.filter(x => x.type === this.roleFilter);
    }

    this.filteredCharacters = sortedChars;
  }

  selectChar(char: Character) {
    this.modalCtrl.dismiss(char);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
