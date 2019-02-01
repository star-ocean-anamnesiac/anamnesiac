import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent implements OnInit {

  @Input()
  public element = 'None';

  @Input()
  public iconOnly = false;

  constructor() { }

  ngOnInit() {
  }

}
