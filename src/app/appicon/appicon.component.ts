import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { get } from 'lodash';

import * as appicons from '../../assets/icons/+app-icons.json';
import * as itemicons from '../../assets/items/+item-icons.json';

const sheetTypes: any = {
  icon: (<any>appicons).default || appicons,
  item: (<any>itemicons).default || itemicons
};

const sheetPaths = {
  icon: 'assets/icons/+app-icons.png',
  item: 'assets/items/+item-icons.png'
}

@Component({
  selector: 'app-appicon',
  templateUrl: './appicon.component.html',
  styleUrls: ['./appicon.component.scss']
})
export class AppIconComponent implements OnInit {

  get sheetUrl() {
    return sheetPaths[this.type];
  }

  get spriteSheet() {
    return sheetTypes[this.type];
  }

  @Input()
  public name: string;

  @Input()
  public scaleX: number;

  @Input()
  public scaleY: number;

  @Input()
  public forceWidth: number;

  @Input()
  public forceHeight: number;

  @Input()
  public type: 'icon'|'item' = 'icon';

  @Input()
  @HostBinding('class.inline-display')
  public inline: boolean;

  public get scale() {
    let scaleX = this.scaleX;
    let scaleY = this.scaleY;

    if(this.forceWidth) {
      scaleX = 1 * (this.forceWidth / this.widthNumber);
    }

    if(this.forceHeight) {
      scaleY = 1 * (this.forceHeight / this.heightNumber);
    }

    return `scale(${scaleX}, ${scaleY})`;
  }

  @HostBinding('style.max-width')
  @HostBinding('style.min-width')
  get width() {
    if(this.forceWidth) { return this.forceWidth + 'px'; }
    return (this.widthNumber * this.scaleX) + 'px';
  }

  get innerWidth() {
    return this.widthNumber + 'px';
  }

  private get widthNumber(): number {
    return get(this.spriteSheet.frames, [`${this.name}.png`, 'frame', 'w'], 0);
  }

  @HostBinding('style.max-height')
  @HostBinding('style.min-height')
  get height() {
    if(this.forceHeight) { return this.forceHeight + 'px'; }
    return (this.heightNumber * this.scaleY) + 'px';
  }

  get innerHeight() {
    return this.heightNumber + 'px';
  }

  private get heightNumber(): number {
    return get(this.spriteSheet.frames, [`${this.name}.png`, 'frame', 'h'], 0);
  }

  get coordinates() {
    // style.object-position
    const spriteRef = this.spriteSheet.frames[this.name + '.png'];
    if(!spriteRef) { return '0px 0px'; }

    return `-${spriteRef.frame.x}px -${spriteRef.frame.y}px`;
  }

  ngOnInit() {
  }

}
