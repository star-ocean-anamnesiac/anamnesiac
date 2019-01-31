import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-weapon',
  templateUrl: './weapon.component.html',
  styleUrls: ['./weapon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeaponComponent implements OnInit {

  @Input()
  public set weapon(weapon: string) {
    this.weaponType = weapon;
    this.weaponNice = this.dataService.properifyItem(weapon);
  }

  public weaponType: string;
  public weaponNice: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

}
