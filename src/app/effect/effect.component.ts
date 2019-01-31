import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-effect',
  templateUrl: './effect.component.html',
  styleUrls: ['./effect.component.scss']
})
export class EffectComponent implements OnInit {

  @Input()
  public effect = '';

  constructor() { }

  ngOnInit() {
  }

}
