import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lazy-img',
  templateUrl: './lazy-img.component.html',
  styleUrls: ['./lazy-img.component.scss']
})
export class LazyImgComponent {

  public loaded: boolean;

  @Input()
  public src: string;

  @Input()
  public alt: string;

}
