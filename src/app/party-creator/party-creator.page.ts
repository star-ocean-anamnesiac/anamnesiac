
import { includes, find, clone, groupBy, sortBy, isString } from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { ModalController } from '@ionic/angular';
import { Subscription, zip } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

import { CharacterListModal } from './character-list.modal';
import { Character } from '../models/character';
import { DataService } from '../data.service';
import { Item } from '../models/item';
import { isUndefined } from 'util';
import { ItemListModal } from './item-list.modal';

@Component({
  selector: 'app-party-creator',
  templateUrl: './party-creator.page.html',
  styleUrls: ['./party-creator.page.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        visibility: 'visible'
      })),
      state('closed', style({
        opacity: 0,
        visibility: 'hidden',
        'max-height': '0px'
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class PartyCreatorPage implements OnInit, OnDestroy {

  private router$: Subscription;
  private allData$: Subscription;

  public characters: string[] = [];
  public charRefs: Character[] = [];

  public accessories: string[] = [];
  public accessoryRefs: Item[] = [];

  public weapons: string[] = [];
  public weaponRefs: Item[] = [];

  private allCharacters: Character[];
  private filteredCharacters: Character[];

  private allItems: Item[];
  private filteredItems: Item[];

  public region: string;
  public conditionToggle: boolean;
  public roleToggle: boolean;
  public showShare: boolean;

  public readonly baseStats = { HP: true, ATK: true, INT: true, DEF: true, GRD: true, HIT: true };

  public readonly buffPriorityDescs = {
    1: 'Talent/Rush Stat Buffs',
    2: 'Skill-applied Stat Buffs',
    3: 'Self-conditional Stat Buffs',
    4: 'Self-only Stat Buffs',
    5: 'Other Buffs'
  };

  public priorityVisibility = [false, false, false, false];

  public buffs: any = {};
  public optimalBuffs: { [key: string]: number } = {};
  public characterOptimalBuffBoosts: { [key: string]: Array<{ character: string, boost: number }> } = {};

  public characterSprites: { [key: string]: string } = {};

  public isReady: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.showShare = !!(<any>navigator).share;
    this.characters.length = 4;
    this.charRefs.length = 4;

    this.roleToggle = this.roleToggleParam();
    this.conditionToggle = this.conditionalToggleParam();

    this.localStorage.observe('isJP').subscribe(val => {
      this.updateRegionBasedOn(val);
      this.updateCharacters();
      this.updateParty();
    });

    this.router$ = this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        if(!includes(x.url, 'party-creator')) { return; }
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.updateBuffs();
      });

    this.allData$ = zip(this.dataService.characters$, this.dataService.items$)
      .subscribe(([chars, items]) => {
        this.isReady = true;
        this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
        this.allCharacters = chars;
        this.allItems = items;

        this.updateCharacters();
        this.updateItems();
        this.updateParty();
      });
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
    this.allData$.unsubscribe();
  }

  public toggleCondition() {
    this.conditionToggle = !this.conditionToggle;
    this.navigateHere();

    this.updateBuffs();
  }

  public toggleRole() {
    this.roleToggle = !this.roleToggle;
    this.navigateHere();

    this.updateBuffs();
  }

  public share() {
    if(!(<any>navigator).share) {
      alert('You cannot share at this time, sorry.');
      return;
    }

    (<any>navigator).share({
      title: 'Anamnesiac Party Creator',
      url: location.href
    });
  }

  private updateCharacters() {
    this.filteredCharacters = this.allCharacters.filter(x => x.cat === this.region);
  }

  private updateItems() {
    this.filteredItems = this.allItems.filter(x => x.cat === this.region);
  }

  private updateParty() {
    if(!this.isReady) { return; }

    const party = this.getParty();
    const partyChars = party.split(',');
    partyChars.forEach((charName, i) => {
      const ref = find(this.filteredCharacters, { name: charName });
      if(!ref) {
        this.setChar(undefined, i);
        return;
      }

      this.setChar(ref, i);
    });

    const acc = this.getAccessories();
    const accItems = acc.split(',');
    accItems.forEach((itemName, i) => {
      const ref = find(this.filteredItems, { name: itemName });
      if(!ref) {
        this.setAccessory(undefined, i);
        return;
      }

      this.setAccessory(ref, i);
    });

    const weap = this.getWeapons();
    const weapItems = weap.split(',');
    weapItems.forEach((itemName, i) => {
      const ref = find(this.filteredItems, { name: itemName });
      if(!ref) {
        this.setWeapon(undefined, i);
        return;
      }

      this.setWeapon(ref, i);
    });
  }

  private setChar(char: Character, index: number) {
    if(char) {
      this.charRefs[index] = char;
      this.characters[index] = char.name;
    } else {
      this.charRefs[index] = undefined;
      this.characters[index] = undefined;
    }

    this.updatePictures();
    this.updateBuffs();
  }

  private setAccessory(acc: Item, index: number) {
    if(acc) {
      this.accessoryRefs[index] = acc;
      this.accessories[index] = acc.name;
    } else {
      this.accessoryRefs[index] = undefined;
      this.accessories[index] = undefined;
    }

    this.updateBuffs();
  }

  private setWeapon(weap: Item, index: number) {
    if(weap) {
      this.weaponRefs[index] = weap;
      this.weapons[index] = weap.name;
    } else {
      this.weaponRefs[index] = undefined;
      this.weapons[index] = undefined;
    }

    this.updateBuffs();
  }

  private navigateHere() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        party: this.getParty(),
        acc: this.getAccessories(),
        weap: this.getWeapons(),
        conditional: ~~this.conditionToggle,
        role: ~~this.roleToggle
      }
    });
  }

  private updateRegionBasedOn(val: boolean) {
    this.region = val ? 'jp' : 'gl';

    this.navigateHere();
  }

  async openModal(index: number) {

    const modal = await this.modalCtrl.create({
      component: CharacterListModal,
      componentProps: {
        characters: this.filteredCharacters
      }
    });

    modal.onDidDismiss().then((val) => {
      if(!val) { return; }

      const char = val.data;
      if(isUndefined(char)) return;

      this.setChar(char, index);

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          region: this.region,
          party: this.characters.join(','),
          acc: this.getAccessories(),
          weap: this.getWeapons()
        }
      });
    });

    await modal.present();
  }

  async openItemModal(index: number, type: string) {

    const modal = await this.modalCtrl.create({
      component: ItemListModal,
      componentProps: {
        items: this.filteredItems.filter(x => type === 'accessory' ? (x.subtype === 'all') : x.subtype === type)
      }
    });

    modal.onDidDismiss().then((val) => {
      if(!val) { return; }

      const item = val.data;
      if(isUndefined(item)) return;

      if(type === 'accessory') {
        this.setAccessory(item, index);
      } else {
        this.setWeapon(item, index);
      }

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          region: this.region,
          party: this.getParty(),
          acc: this.accessories.join(','),
          weap: this.weapons.join(',')
        }
      });
    });

    await modal.present();
  }

  private getParty(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('party') || '';
  }

  private getWeapons(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('weap') || '';
  }

  private getAccessories(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('acc') || '';
  }

  private conditionalToggleParam(): boolean {
    const parameters = new URLSearchParams(window.location.search);
    const param = parameters.get('conditional');
    return !isString(param) ? true : !!+param;
  }

  private roleToggleParam(): boolean {
    const parameters = new URLSearchParams(window.location.search);
    const param = parameters.get('role');
    return !isString(param) ? true : !!+param;
  }

  private updatePictures() {
    this.characterSprites = {};

    this.charRefs.forEach(char => {
      if(!char) { return; }

      this.characterSprites[char.name] = char.picture;
    });
  }

  private updateBuffs() {
    const buffs = [];

    const assignMeta = (meta, eff, char, name) => {
      const allMeta = [];

      (meta.buffs || [meta.buff]).forEach(buffName => {
        const metaRet = clone(meta);
        metaRet.buff = buffName;
        metaRet.source = name;
        metaRet.sourceCharacter = char.name;

        metaRet._metaAll = eff.all;

        if(!this.baseStats[metaRet.buff]) { metaRet.priority = 5; }

        allMeta.push(metaRet);
      });

      return allMeta;
    };

    this.charRefs.forEach(charRef => {
      if(!charRef) { return; }

      charRef.rush.effects.forEach(rushEff => {
        if(!rushEff.meta) { return; }

        const meta = assignMeta(rushEff.meta, rushEff, charRef, `${charRef.rush.name} [Rush]`);
        buffs.push(...meta);
      });

      charRef.skills.forEach(skill => {
        if(!skill.meta) { return; }

        const skillRef = assignMeta(skill.meta, skill, charRef, `${skill.name} [Skill]`);
        buffs.push(...skillRef);
      });

      charRef.talents.forEach(talent => {
        talent.effects.forEach(talEffect => {
          if(!talEffect.meta) { return; }

          const talEffRef = assignMeta(talEffect.meta, talEffect, charRef, `${talent.name} [Talent]`);
          buffs.push(...talEffRef);
        });
      });
    });

    this.accessoryRefs.forEach((accRef, i) => {
      accRef.factors.forEach(fact => {
        if(!fact.meta) { return; }

        const factorMeta = assignMeta(fact.meta, fact, this.charRefs[i], `${accRef.name}`);
        buffs.push(...factorMeta);
      });
    });

    const prioritySortedBuffs = groupBy(buffs, 'priority');
    Object.keys(prioritySortedBuffs).forEach(priorityKey => {
      prioritySortedBuffs[priorityKey] = groupBy(prioritySortedBuffs[priorityKey], 'buff');

      Object.keys(prioritySortedBuffs[priorityKey]).forEach(buffKey => {
        prioritySortedBuffs[priorityKey][buffKey] = sortBy(prioritySortedBuffs[priorityKey][buffKey], x => -x.buffValue);
      });
    });

    this.buffs = prioritySortedBuffs;

    this.calculateOptimalBuffs();
  }

  private calculateOptimalBuffs() {
    const allBuffs = {};
    const specCharacterBuffs = {};

    // handle the optimal buffs
    Object.keys(this.buffs).forEach(priorityKey => {
      Object.keys(this.buffs[priorityKey]).forEach(buffKey => {

        // handle other buffs
        if(priorityKey === '5') {

          // first pass: calculate the global total
          this.buffs[priorityKey][buffKey].forEach(tBuffData => {

            // init the global one so it shows up
            allBuffs[tBuffData.buff] = allBuffs[tBuffData.buff] || 0;

            // if it's a priority-5 meta-all, we add it to the global (but take the max value)
            if(tBuffData._metaAll) {
              allBuffs[tBuffData.buff] = Math.max(allBuffs[tBuffData.buff], tBuffData.buffValue);
            }
          });

          // second pass: calculate the individual character totals with respect to the global totals
          this.buffs[priorityKey][buffKey].forEach(tBuffData => {
            if(tBuffData._metaAll) { return; }

            // track individual character buffs
            const char = tBuffData.sourceCharacter;

            specCharacterBuffs[char] = specCharacterBuffs[char] || {};
            specCharacterBuffs[char][tBuffData.buff] = specCharacterBuffs[char][tBuffData.buff] || 0;

            if(tBuffData.buffValue > allBuffs[tBuffData.buff]) {
              specCharacterBuffs[char][tBuffData.buff] = tBuffData.buffValue - allBuffs[tBuffData.buff];
            }
          });

          return;
        }

        // rip out self buffs
        if(priorityKey === '4' || priorityKey === '3') {
          this.buffs[priorityKey][buffKey].forEach(tBuffData => {

            // init the global one so it shows up
            allBuffs[tBuffData.buff] = allBuffs[tBuffData.buff] || 0;

            // track individual character buffs
            const char = tBuffData.sourceCharacter;

            specCharacterBuffs[char] = specCharacterBuffs[char] || {};
            specCharacterBuffs[char][tBuffData.buff] = specCharacterBuffs[char][tBuffData.buff] || 0;
            specCharacterBuffs[char][tBuffData.buff] += tBuffData.buffValue;
          });

          return;
        }

        // if its not priority 3/4, we take the first one and work with that
        const buffData = this.buffs[priorityKey][buffKey][0];

        if(buffData.buffRole && !this.roleToggle) { return; }
        if(buffData.buffCondition && !this.conditionToggle) { return; }

        if(buffData.buffRole) {

          this.charRefs.forEach(charRef => {
            if(charRef.type !== buffData.buffRole) { return; }

            const char = charRef.name;

            specCharacterBuffs[char] = specCharacterBuffs[char] || {};
            specCharacterBuffs[char][buffData.buff] = specCharacterBuffs[char][buffData.buff] || 0;
            specCharacterBuffs[char][buffData.buff] += buffData.buffValue;
          });

        } else {
          allBuffs[buffData.buff] = allBuffs[buffData.buff] || 0;
          allBuffs[buffData.buff] += buffData.buffValue;
        }
      });
    });

    this.optimalBuffs = allBuffs;

    // handle the individual buffs
    const charBuffObj = {};

    Object.keys(specCharacterBuffs).forEach(character => {
      Object.keys(specCharacterBuffs[character]).forEach(buff => {
        charBuffObj[buff] = charBuffObj[buff] || [];
        charBuffObj[buff].push({ character, boost: specCharacterBuffs[character][buff] });
      });
    });

    this.characterOptimalBuffBoosts = charBuffObj;
  }

}
