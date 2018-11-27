

import YAML from 'js-yaml';
import axios from 'axios';

import { Injectable } from '@angular/core';
import { Character } from './models/character';
import { BehaviorSubject } from 'rxjs';

interface Item {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public classes: Item[] = [];
  public weapons: Item[] = [];
  public accessories: Item[] = [];

  public characters$: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);

  private characters: Character[] = [];
  private itemNameHash: any = {};

  constructor() { }

  async loadRootData() {
    const { data } = await axios.get('assets/data/root.yml');
    const { classes, weapons, accessories } = YAML.safeLoad(data);

    this.classes = classes.map(x => ({ id: x.toLowerCase(), name: x }));
    this.weapons = weapons;
    this.accessories = accessories;

    weapons.forEach(({ id, name }) => this.itemNameHash[id] = name);

    this.loadAllDetailData();
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
  }
}
