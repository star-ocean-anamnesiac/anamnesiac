import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-effect',
  templateUrl: './effect.component.html',
  styleUrls: ['./effect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EffectComponent implements OnInit {

  @Input()
  public effect = '';

  constructor() { }

  ngOnInit() {
  }

}
