import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slayer',
  templateUrl: './slayer.component.html',
  styleUrls: ['./slayer.component.scss']
})
export class SlayerComponent implements OnInit {

  @Input()
  public slayer: string;

  constructor() { }

  ngOnInit() {
  }

}
