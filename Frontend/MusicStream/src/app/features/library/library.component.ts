import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, catchError, map, takeUntil } from 'rxjs';
import { MusicCategory, Track } from '../../core/models/track';
import { TrackService } from '../../core/services/indexed-db.service';
import { SearchService } from '../../core/services/search.service';
import { SongService } from '../../core/services/song.service';
import { addTrack } from '../store/actions/track.action';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})

export class LibraryComponent  {
  songs: Track[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';
  selectedTrack: Track = { id: '', title: '',addedAt : new Date,artist : '', category: MusicCategory.OTHER,duration:0,fileUrl:'',imageUrl:'',description:'',albumId:'' };
  categories = Object.values(MusicCategory);
  showModal: boolean = false

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.loadSongs();
  }

  loadSongs() {
    this.songService.getAllSongs(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.songs = response.content;
        this.totalItems = response.totalElements;
      },
      error => console.error('Error loading songs:', error)
    );
  }

  searchSongs() {
    if (this.searchTerm.trim()) {
      this.songService.searchSongsByTitle(this.searchTerm, this.currentPage, this.pageSize).subscribe(
        (response: any) => {
          this.songs = response.content;
          this.totalItems = response.totalElements;
        },
        error => console.error('Error searching songs:', error)
      );
    } else {
      this.loadSongs();
    }
  }

  createSong() {
    this.songService.createSong(this.selectedTrack).subscribe(
      (createdSong) => {
        this.songs.unshift(createdSong);
        this.selectedTrack = { id: '', title: '',addedAt : new Date,artist : '', category: MusicCategory.OTHER,duration:0,fileUrl:'',imageUrl:'',description:'',albumId:'' };
      },
      error => console.error('Error creating song:', error)
    );
  }

  updateSong(song: Track) {
    this.songService.updateSong(song.id, song).subscribe(
      (updatedSong) => {
        const index = this.songs.findIndex(s => s.id === updatedSong.id);
        if (index !== -1) {
          this.songs[index] = updatedSong;
        }
      },
      error => console.error('Error updating song:', error)
    );
  }

  deleteSong(id: string) {
    this.songService.deleteSong(id).subscribe(
      () => {
        this.songs = this.songs.filter(song => song.id !== id);
      },
      error => console.error('Error deleting song:', error)
    );
  }

  nextPage() {
    this.currentPage++;
    this.loadSongs();
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadSongs();
    }
  }
  clearSelection(): void {
    this.selectedTrack = {
      id: '',
      title: '',
      artist: '',
      addedAt : new Date,
      category: MusicCategory.OTHER,
      duration:0,
      fileUrl:'',
      imageUrl:'',
      description:'',
      albumId:'' 
    };
  }
  onSubmit(): void {
    if (!this.selectedTrack.title || !this.selectedTrack.artist || !this.selectedTrack.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.selectedTrack.id) {
      this.updateSong(this.selectedTrack);
    } else {
      this.createSong();
    }
  }
   selectTrack(song: Track): void {
      this.selectedTrack = { ...song };
  }

  openModalForUpdate(album: Track): void {
      this.selectedTrack = { ...album }; 
      this.showModal = true;
  }

  openModal(){
    this.clearSelection();
    this.showModal = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.clearSelection();
  }

}