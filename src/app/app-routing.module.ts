import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'characters',
    loadChildren: './character-list/character-list.module#CharacterListPageModule'
  },
  {
    path: 'items',
    loadChildren: './item-list/item-list.module#ItemListPageModule'
  },
  {
    path: 'party-creator',
    loadChildren: './party-creator/party-creator.module#PartyCreatorPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
