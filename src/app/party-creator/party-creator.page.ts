
import { includes, find, clone, groupBy, sortBy } from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';

import { CharacterListModal } from './character-list.modal';
import { Character } from '../models/character';
import { DataService } from '../data.service';

@Component({
  selector: 'app-party-creator',
  templateUrl: './party-creator.page.html',
  styleUrls: ['./party-creator.page.scss'],
})
export class PartyCreatorPage implements OnInit, OnDestroy {

  private router$: Subscription;
  private characters$: Subscription;

  public characters: string[] = [];
  public charRefs: Character[] = [];

  private allCharacters: Character[];
  private filteredCharacters: Character[];

  public region: string;

  public buffPriorityDescs = {
    1: 'Talent/Rush Buffs',
    2: 'Skill-applied Buffs',
    3: 'Self-conditional Buffs',
    4: 'Self-only Buffs'
  };

  public buffs: any = {};
  public optimalBuffs: { [key: string]: number } = {};
  public characterOptimalBuffBoosts: { [key: string]: Array<{ character: string, boost: number }> } = {};

  public characterSprites: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorageService,
    private modalCtrl: ModalController,
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.characters.length = 4;
    this.charRefs.length = 4;

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

    this.characters$ = this.dataService.characters$.subscribe(chars => {
      this.updateRegionBasedOn(this.localStorage.retrieve('isJP'));
      this.allCharacters = chars;

      this.updateCharacters();
      this.updateParty();
    });
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
    this.characters$.unsubscribe();
  }

  private updateCharacters() {
    this.filteredCharacters = this.allCharacters.filter(x => x.cat === this.region);
  }

  private updateParty() {
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

  private updateRegionBasedOn(val: boolean) {
    this.region = val ? 'jp' : 'gl';

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        region: this.region,
        party: this.getParty()
      }
    });
  }

  async openModal(index: number) {

    const modal = await this.modalCtrl.create({
      component: CharacterListModal,
      componentProps: {
        characters: this.filteredCharacters
      }
    });

    modal.onDidDismiss().then((val) => {
      const char = val.data;
      if(!char) { return; }

      this.setChar(char, index);

      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          region: this.region,
          party: this.characters.join(',')
        }
      });
    });

    await modal.present();
  }

  private getParty(): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('party') || '';
  }

  private updatePictures() {
    this.characterSprites = {};

    this.charRefs.forEach(char => {
      if(!char) { return; }

      this.characterSprites[char.name] = `assets/characters/${char.picture}.png`;
    });
  }

  private updateBuffs() {
    const buffs = [];

    const assignMeta = (meta, char, name) => {
      const metaRet = clone(meta);
      metaRet.source = name;
      metaRet.sourceCharacter = char.name;

      return metaRet;
    };

    this.charRefs.forEach(charRef => {
      charRef.rush.effects.forEach(rushEff => {
        if(!rushEff.meta) { return; }

        const meta = assignMeta(rushEff.meta, charRef, `${charRef.rush.name} [Rush]`);
        buffs.push(meta);
      });

      charRef.skills.forEach(skill => {
        if(!skill.meta) { return; }

        const skillRef = assignMeta(skill.meta, charRef, `${skill.name} [Skill]`);
        buffs.push(skillRef);
      });

      charRef.talents.forEach(talent => {
        talent.effects.forEach(talEffect => {
          if(!talEffect.meta) { return; }

          const talEffRef = assignMeta(talEffect.meta, charRef, `${talent.name} [Talent]`);
          buffs.push(talEffRef);
        });
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

        // rip out self buffs
        if(priorityKey === '4') {
          this.buffs[priorityKey][buffKey].forEach(tBuffData => {
            const char = tBuffData.sourceCharacter;
            specCharacterBuffs[char] = specCharacterBuffs[char] || {};
            specCharacterBuffs[char][tBuffData.buff] = specCharacterBuffs[char][tBuffData.buff] || 0;
            specCharacterBuffs[char][tBuffData.buff] += tBuffData.buffValue;
          });
          return;
        }

        const buffData = this.buffs[priorityKey][buffKey][0];

        allBuffs[buffData.buff] = allBuffs[buffData.buff] || 0;
        allBuffs[buffData.buff] += buffData.buffValue;
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
