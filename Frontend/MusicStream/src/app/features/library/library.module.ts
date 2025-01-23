import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryRoutingModule } from './library-routing.module';
import { LibraryComponent } from './library.component';
import { SongModalComponent } from '../song-modal/song-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LibraryComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SongModalComponent  ,
    FormsModule
  ]
})
export class LibraryModule { }