import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AlbumComponent } from './features/album/album.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

const routes: Routes = [
   { path: 'library', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule) },
   { path: 'library/:id', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule) },
   { path: 'track/:id', loadChildren: () => import('./features/track/track.module').then(m => m.TrackModule) },
   { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
   {path : '' , component : LoginComponent},
   {path : 'register' , component : RegisterComponent},
   {path : 'album' ,component : AlbumComponent},
   {path : 'dashboard' , component : DashboardComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
