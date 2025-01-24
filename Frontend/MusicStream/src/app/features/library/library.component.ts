import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicCategory, Track } from '../../core/models/track';
import { SongService } from '../../core/services/song.service';

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
  selectedTrack: Track = { id: '', titre: '',date : new Date,artiste : '', category: MusicCategory.OTHER,duree:0,audioFile:'',imageUrl:'',description:'',albumId:'' };
  categories = Object.values(MusicCategory);
  showModal: boolean = false

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.loadSongs();
  }

  loadSongs() {
    this.songService.getAllSongs(this.currentPage, this.pageSize).subscribe({
      next : (data) =>{
        this.songs = data.content;
        this.totalItems = data.totalElements;
        console.log('Songs loaded:', data.content);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des albums :', err);
      },
    });
  }

  searchSongs() {
    if (this.searchTerm.trim()) {
      this.songService.searchSongsByTitle(this.searchTerm, this.currentPage, this.pageSize).subscribe({
        next : (response) =>{
          this.songs = response.content;
          this.totalItems = response.totalElements;
        },
        error : 
        (error) => console.error('Error searching songs:', error)
    })
    } else {
      this.loadSongs();
    }
  }

  createSong() {
    this.songService.createSong(this.selectedTrack).subscribe({
       next : (createdSong) => {
        this.songs.unshift(createdSong);
        this.selectedTrack = { id: '', titre: '',date : new Date,artiste : '', category: MusicCategory.OTHER,duree:0,audioFile:'',imageUrl:'',description:'',albumId:'' };
      },
      error :
      error => console.error('Error creating song:', error)
    });
  }

  updateSong(song: Track) {
    this.songService.updateSong(song.id, song).subscribe({
      next : (updatedSong) => {
        const index = this.songs.findIndex(s => s.id === updatedSong.id);
        if (index !== -1) {
          this.songs[index] = updatedSong;
        }
      },
      error :
      error => console.error('Error updating song:', error)
  });
  }

  deleteSong(id: string) {
    this.songService.deleteSong(id).subscribe({
     next : () => {
        this.songs = this.songs.filter(song => song.id !== id);
      },
      error :
      error => console.error('Error deleting song:', error)
  });
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
      titre: '',
      artiste: '',
      date : new Date,
      category: MusicCategory.OTHER,
      duree:0,
      audioFile:'',
      imageUrl:'',
      description:'',
      albumId:'' 
    };
  }
  onSubmit(): void {
    if (!this.selectedTrack.titre || !this.selectedTrack.artiste || !this.selectedTrack.category) {
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
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.clearSelection();
  }

}