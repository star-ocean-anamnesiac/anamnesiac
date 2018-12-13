import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Update, Note } from '../models/update';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public updates: Update[] = [];

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.updates = this.dataService.updates;
  }

  public formatUpdate(update: Note[]): string {
    return update.map((note: Note) => {
      const base = note.name;
      return note.notes ? `${base} (${note.notes})` : base;
    }).join(', ');
  }
}
