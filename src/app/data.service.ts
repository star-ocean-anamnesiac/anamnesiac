

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Character } from './models/character';
import { Item } from './models/item';
import { Update } from './models/update';
import { BossGuide } from './models/bossguide.js';

interface ListItem {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private allAppData: any;

  public classes: ListItem[] = [];
  public weaponTypes: ListItem[] = [];
  public accessoryTypes: ListItem[] = [];

  public characters$: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);
  public items$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  public bossGuides$: BehaviorSubject<BossGuide[]> = new BehaviorSubject<BossGuide[]>([]);

  private characters: Character[] = [];
  private items: Item[] = [];
  private bossGuides: BossGuide[] = [];
  public updates: Update[] = [];

  private itemNameHash: any = {};

  constructor(private http: HttpClient) {}

  async loadRootData() {
    this.allAppData = await this.http.get('assets/data.json').toPromise();

    this.loadChangelog();
    const { classes, weapons, accessories } = this.allAppData.root;

    this.classes = classes.map(x => ({ id: x.toLowerCase(), name: x }));
    this.weaponTypes = weapons;
    this.accessoryTypes = accessories;

    weapons.forEach(({ id, name }) => this.itemNameHash[id] = name);

    this.loadAllDetailData();
  }

  private async loadChangelog() {
    this.updates = this.allAppData.changelog;
  }

  public properifyItem(id: string): string {
    return this.itemNameHash[id] || '???';
  }

  private loadAllDetailData() {
    this.characters = this.allAppData.allCharacters;
    this.characters$.next(this.characters);

    this.items = this.allAppData.allItems;
    this.items$.next(this.items);

    this.bossGuides = this.allAppData.allGuides;
    this.bossGuides$.next(this.bossGuides);
  }
}
