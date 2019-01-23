
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

import { ModalController, PopoverController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { DataService } from '../data.service';
import { Character } from '../models/character';
import { CharacterSortPopover, CharacterModal } from './character-list.ui';

@Component({
  selector: 'app-character-list',
  templateUrl: 'character-list.page.html',
  styleUrls: ['character-list.page.scss']
})
export class CharacterListPage implements OnInit, OnDestroy {

  public isError: boolean;
  public allCharacters: Character[] = [];

  @LocalStorage()
  public sorting: 'tier'|'alpha'|'weapon';

  public tierSortedCharacters: { [key: string]: Character[] } = {};
  public allTiers: string[] = [];

  public alphaSortedCharacters: Character[] = [];

  public weaponSortedCharacters: { [key: string]: Character[] } = {};
  public allWeapons: string[] = [];

  public showSearch: boolean;
  public searchValue = '';

  private router$: Subscription;
  private character$: Subscription;
  private hasModal: boolean;

  private region: 'gl'|'jp';

  constructor(
    private dataService: DataService,
    private localStorage: LocalStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    if(!this.sorting) { this.sorting = 'alpha'; }

    this.localStorage.observe('isJP').subscribe(val => {
      this.updateRegionBasedOn(val);
    });

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!_.includes(x.url, 'characters')) { return; }
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.updateCharacterList();
      });

    this.character$ = this.dataService.characters$.subscribe(chars => {
      this.allCharacters = chars;
      this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
      this.updateCharacterList();
    });
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
    this.character$.unsubscribe();
  }

  private updateRegionBasedOn(val: boolean) {
    this.region = val ? 'jp' : 'gl';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        filter: this.getCurrentFilter(),
        region: this.region,
        char: this.getPreviouslyLoadedChar()
      }
    });
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
        region: this.region,
        char: char.name
      }
    });
  }

  // UI MODIFYING FUNCTIONS
  public async loadCharacterModal(name: string) {
    if(this.hasModal) { return; }

    const character = _.find(this.allCharacters, { name, cat: this.region });

    if(!character) { return; }

    this.hasModal = true;

    const modal = await this.modalCtrl.create({
      component: CharacterModal,
      componentProps: {
        character,
        weapon: this.convertWeaponType(character.weapon)
      }
    });

    modal.onDidDismiss().then(() => {
      this.hasModal = false;

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          filter: this.getCurrentFilter(),
          region: this.region
        }
      });
    });

    await modal.present();
  }

  public async openSort(ev) {
    const popover = await this.popoverCtrl.create({
      component: CharacterSortPopover,
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then(({ data }) => {
      if(!data) { return; }
      this.sorting = <'tier'|'alpha'|'weapon'>data;
    });

    return await popover.present();
  }

  public toggleSearch() {
    this.showSearch = !this.showSearch;

    if(!this.showSearch) {
      this.closeSearch();
    }
  }

  public updateSearchValue(ev) {
    if(!ev.detail) {
      this.searchValue = '';
      return;
    }
    const str = ev.target.value;
    this.searchValue = str;
  }

  public closeSearch() {
    this.showSearch = false;
    this.searchValue = '';
  }

  // CHARACTER LIST SORTING
  private updateCharacterList() {
    let arr = this.allCharacters;

    const curFilter = this.getCurrentFilter();
    if(curFilter) {
      arr = this.allCharacters.filter(char => char.type === curFilter);
    }

    arr = arr.filter(char => char.cat === this.region);

    if(arr.length === 0) {
      this.isError = true;
      return;
    }

    this.isError = false;

    // alpha sorting
    this.alphaSortedCharacters = _.sortBy(arr, 'name');

    // weapon sorting
    this.weaponSortedCharacters = _(arr)
      .sortBy('name')
      .groupBy('weapon')
      .value();
    this.allWeapons = _.sortBy(Object.keys(this.weaponSortedCharacters));

    // tier sorting
    this.tierSortedCharacters = _(arr)
      .sortBy([(char) => -Math.floor(char.rating), 'name'])
      .groupBy(char => {
        if(char.rating >= 10) { return 'Top Tier (10/10)'; }
        if(char.rating >= 8 && char.rating < 10) { return 'Great (8-9/10)'; }
        if(char.rating >= 6 && char.rating <  8) { return 'Good (6-7/10)'; }
        if(char.rating >= 4 && char.rating <  6) { return 'Average (4-5/10)'; }
        if(char.rating <= 0)                     { return 'Absolute Trash (0/10)'; }
        return 'Bad (1-3/10)';
      })
      .value();
    this.allTiers = _.sortBy(Object.keys(this.tierSortedCharacters), (tier) => {
      if(tier === 'Top Tier (10/10)')      { return 0; }
      if(tier === 'Great (8-9/10)')        { return 1; }
      if(tier === 'Good (6-7/10)')         { return 2; }
      if(tier === 'Average (4-5/10)')      { return 3; }
      if(tier === 'Bad (1-3/10)')          { return 4; }
      if(tier === 'Absolute Trash (0/10)') { return 5; }
      return 10;
    });

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
