import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-slayer',
  templateUrl: './slayer.component.html',
  styleUrls: ['./slayer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlayerComponent implements OnInit {

  @Input()
  public slayer: string;

  constructor() { }

  ngOnInit() {
  }

}
