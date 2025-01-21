import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';

const routes: Routes = [
   { path: 'library', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule) },
   { path: 'track/:id', loadChildren: () => import('./features/track/track.module').then(m => m.TrackModule) },
   { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
   {path : '' , component : LoginComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
