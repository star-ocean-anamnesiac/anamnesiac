

import YAML from 'js-yaml';
import axios from 'axios';

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
    const { data } = await axios.get('assets/data/root.yml');
    const { classes, weapons, accessories } = YAML.safeLoad(data);

    this.classes = classes.map(x => ({ id: x.toLowerCase(), name: x }));
    this.weaponTypes = weapons;
    this.accessoryTypes = accessories;

    weapons.forEach(({ id, name }) => this.itemNameHash[id] = name);

    this.loadAllDetailData();
  }

  private async loadChangelog() {
    const { data } = await axios.get('assets/data/changelog.yml');
    this.updates = YAML.safeLoad(data);
  }

  public properifyItem(id: string): string {
    return this.itemNameHash[id] || '???';
  }

  private loadAllDetailData() {
    this.classes.forEach(async ({ id }) => {
      const { data } = await axios.get(`assets/data/character/${id}.yml`);
      const characters = YAML.safeLoad(data);

      characters.forEach(char => char.type = id);
      this.characters.push(...characters);

      this.characters$.next(this.characters);
    });

    this.weaponTypes.forEach(async ({ id }) => {
      const { data } = await axios.get(`assets/data/item/weapon/${id}.yml`);
      const weapons = YAML.safeLoad(data);

      weapons.forEach(weap => {
        weap.type = 'weapon';
        weap.subtype = id;
      });
      this.items.push(...weapons);

      this.items$.next(this.items);
    });

    this.accessoryTypes.forEach(async ({ id }) => {
      const { data } = await axios.get(`assets/data/item/accessory/${id}.yml`);
      const accessories = YAML.safeLoad(data);

      accessories.forEach(weap => {
        weap.type = 'accessory';
        weap.subtype = id;
      });
      this.items.push(...accessories);

      this.items$.next(this.items);
    });
  }
}
