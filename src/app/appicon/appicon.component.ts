import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { get } from 'lodash';

import * as appicons from '../../assets/icons/+app-icons.json';

@Component({
  selector: 'app-appicon',
  templateUrl: './appicon.component.html',
  styleUrls: ['./appicon.component.scss']
})
export class AppIconComponent implements OnInit {

  @Input()
  public name: string;

  @Input()
  public scaleX: number;

  @Input()
  public scaleY: number;

  // @HostBinding('style.transform')
  public get scale() {
    return `scale(${this.scaleX}, ${this.scaleY})`;
  }

  @HostBinding('style.max-width')
  @HostBinding('style.min-width')
  get width() {
    return (this.widthNumber * this.scaleX) + 'px';
  }

  get innerWidth() {
    return this.widthNumber + 'px';
  }

  private get widthNumber(): number {
    return get(appicons.frames, [`${this.name}.png`, 'frame', 'w'], 0);
  }

  @HostBinding('style.max-height')
  @HostBinding('style.min-height')
  get height() {
    return (this.heightNumber * this.scaleY) + 'px';
  }

  get innerHeight() {
    return this.heightNumber + 'px';
  }

  private get heightNumber(): number {
    return get(appicons.frames, [`${this.name}.png`, 'frame', 'h'], 0);
  }

  get coordinates() {
    // style.object-position
    const spriteRef = appicons.frames[this.name + '.png'];
    if(!spriteRef) return '0px 0px';

    return `-${spriteRef.frame.x}px -${spriteRef.frame.y}px`;
  }

  ngOnInit() {
  }

}
