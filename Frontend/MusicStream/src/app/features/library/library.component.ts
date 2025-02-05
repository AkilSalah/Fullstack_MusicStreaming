import { Component, OnInit, OnDestroy } from '@angular/core';
import { MusicCategory, Track } from '../../core/models/track';
import { SongService } from '../../core/services/song.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})

export class LibraryComponent {
  songs: Track[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';
  selectedTrack: Track = {
    id: '',
    titre: '',
    date: new Date(),
    artiste: '',
    category: MusicCategory.OTHER,
    duree: 0,
    audioFile: '',
    description: '',
    albumId: ''
  };
  categories = Object.values(MusicCategory);
  showModal: boolean = false;
  albumId: string | null = null;
  selectedAudioFile: File | null = null;
  isAdmin: boolean = false;

  constructor(private songService: SongService,private auth: AuthService, private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    this.albumId = this.router.snapshot.paramMap.get('id');
    if (this.albumId) {
      console.log('Album ID:', this.albumId);
      this.loadSongsByAlbum(this.albumId);
    } else {
      console.error('Album ID is missing.');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedAudioFile = file;
      this.selectedTrack.audioFile = file.name;
    }
  }

  createSong(): void {
    if (!this.albumId) {
        alert('Album ID is missing.');
        return;
    }
    if (!this.selectedAudioFile) {
        alert('Please select an audio file.');
        return;
    }

    if (!this.selectedAudioFile.type.startsWith('audio/')) {
        alert('Please select a valid audio file.');
        return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (this.selectedAudioFile.size > maxSize) {
        alert('File size too large. Please select a file under 10MB.');
        return;
    }

    this.selectedTrack.date = new Date(this.selectedTrack.date);
    this.selectedTrack.albumId = this.albumId;

    let loading = true; 

    this.songService.createSong(this.selectedTrack, this.selectedAudioFile).subscribe({
        next: (createdSong) => {
            this.songs.unshift(createdSong);
            this.clearSelection();
            console.log('Song created successfully:', createdSong);
            this.closeModal();
        },
        error: (error) => {
            console.error('Error creating song:', error);
            alert('Failed to upload song. Please check the console for details.');
        },
        complete: () => {
            loading = false;
        }
    });
}

  clearSelection(): void {
    this.selectedTrack = {
      id: '',
      titre: '',
      date: new Date(),
      artiste: '',
      category: MusicCategory.OTHER,
      duree: 0,
      audioFile: '',
      description: '',
      albumId: ''
    };
    this.selectedAudioFile = null;
  }



  loadSongs() {
    this.songService.getAllSongs(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.songs = data.content;
        this.totalItems = data.totalElements;
        console.log('Songs loaded:', data.content);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des albums :', err);
      },
    });
  }

  loadSongsByAlbum(albumId: string) {
    this.songService.getSongsByAlbum(albumId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.songs = data.content;
        this.totalItems = data.totalElements;
        console.log('Songs loaded:', this.songs);
      },
      error: (err) => {
        console.error('Error loading songs:', err);
      }
    });
  }


  searchSongs() {
    if (this.searchTerm.trim()) {
      this.songService.searchSongsByTitle(this.searchTerm, this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.songs = response.content;
          this.totalItems = response.totalElements;
        },
        error: (error) => console.error('Error searching songs:', error)
      });
    } else {
      this.loadSongs();
    }
  }

  updateSong(song: Track) {
    this.songService.updateSong(song.id, song).subscribe({
      next: (updatedSong) => {
        const index = this.songs.findIndex(s => s.id === updatedSong.id);
        if (index !== -1) {
          this.songs[index] = updatedSong; 
        }
        console.log('Song updated successfully:', updatedSong);
      },
      error: (error) => console.error('Error updating song:', error)
    });
  }

  deleteSong(id: string) {
    if (confirm('Are you sure you want to delete this song?')) {
      this.songService.deleteSong(id).subscribe({
        next: () => {
          this.songs = this.songs.filter(song => song.id !== id); 
        },
        error: (error) => console.error('Error deleting song:', error)
      });
    }
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

  onSubmit(): void {
    if (!this.selectedTrack.titre || !this.selectedTrack.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.selectedTrack.id) {
      this.updateSong(this.selectedTrack);
      this.closeModal()
    } else {
      this.createSong(); 
      this.closeModal()
    }
  }

  selectTrack(song: Track): void {
    this.selectedTrack = { ...song };
    this.selectedTrack.albumId = this.albumId || song.albumId; 
  }

  openModalForUpdate(song: Track): void {
    this.selectedTrack = { ...song };
    this.selectedTrack.albumId = this.albumId || song.albumId; 
    this.showModal = true;
  }

  openModal() {
    this.clearSelection();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.clearSelection();
  }
}