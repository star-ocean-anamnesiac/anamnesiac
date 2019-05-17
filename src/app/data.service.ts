

import * as allAppData from './data.json';

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Character } from './models/character';
import { Item } from './models/item';
import { Update } from './models/update';
import { BossGuide } from './models/bossguide';
import { Shop } from './models/shop';

interface ListItem {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public classes: ListItem[] = [];
  public weaponTypes: ListItem[] = [];
  public accessoryTypes: ListItem[] = [];

  public characters$: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);
  public items$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  public bossGuides$: BehaviorSubject<BossGuide[]> = new BehaviorSubject<BossGuide[]>([]);
  public shops$: BehaviorSubject<Shop[]> = new BehaviorSubject<Shop[]>([]);
  public stamps$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private characters: Character[] = [];
  private items: Item[] = [];
  private bossGuides: BossGuide[] = [];
  private shops: Shop[] = [];
  private stamps: any[] = [];
  public updates: Update[] = [];

  private itemNameHash: any = {};

  constructor() { }

  async loadRootData() {
    this.loadChangelog();
    const { classes, weapons, accessories } = allAppData.root;

    this.classes = classes.map(x => ({ id: x.toLowerCase(), name: x }));
    this.weaponTypes = weapons;
    this.accessoryTypes = accessories;

    weapons.forEach(({ id, name }) => this.itemNameHash[id] = name);

    this.loadAllDetailData();
  }

  private async loadChangelog() {
    this.updates = allAppData.changelog;
  }

  public properifyItem(id: string): string {
    return this.itemNameHash[id] || '???';
  }

  private loadAllDetailData() {
    this.characters = allAppData.allCharacters;
    this.characters$.next(this.characters);

    this.items = allAppData.allItems;
    this.items$.next(this.items);

    this.bossGuides = allAppData.allGuides;
    this.bossGuides$.next(this.bossGuides);

    this.stamps = allAppData.allStamps;
    this.stamps$.next(this.stamps);

    this.shops = allAppData.allShops;
    this.shops$.next(this.shops);
  }
}
