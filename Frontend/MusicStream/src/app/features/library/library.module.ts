import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryRoutingModule } from './library-routing.module';
import { LibraryComponent } from './library.component';
// import { SongModalComponent } from '../song-modal/song-modal.component';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@NgModule({
  declarations: [
    LibraryComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    FormsModule
  ]
})
export class LibraryModule { }