

import { default as allAppData } from './data.json';

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Character } from './models/character';
import { Item } from './models/item';
import { Update } from './models/update';

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

  private characters: Character[] = [];
  private items: Item[] = [];
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
  }
}
