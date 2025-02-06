import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AlbumComponent } from './features/album/album.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin-guard.guard';
import { AlbumResolver } from './core/resolver/album-resolver.resolver';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 

  { path: 'library', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule), canActivate: [AuthGuard] },
  { path: 'library/:id', loadChildren: () => import('./features/library/library.module').then(m => m.LibraryModule), canActivate: [AuthGuard],
    resolve: {
      songs: AlbumResolver
    }
   },
   { path: 'album', component: AlbumComponent, canActivate: [AuthGuard] }, 

  { path: 'track/:id', loadChildren: () => import('./features/track/track.module').then(m => m.TrackModule), canActivate: [AuthGuard] },
  { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
