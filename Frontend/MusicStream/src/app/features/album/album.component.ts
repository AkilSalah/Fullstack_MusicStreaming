import { Component } from '@angular/core';
import { AlbumService } from '../../core/services/album.service';
import { Album } from '../../core/models/album';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})

export class AlbumComponent {
  albums: Album[] = [];
  currentPage = 0;
  totalPages = 0;
  selectedAlbum: Album = {
    id: '',
    titre: '',
    artiste: '',
    annee: 0
  };
  isAdmin : boolean = false;
  showModal: boolean = false

  constructor(private albumService: AlbumService , private auth : AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    this.loadAlbums();
  }



  openModalForUpdate(album: Album): void {
    this.selectedAlbum = { ...album }; 
    this.showModal = true;
  }

  onSubmit(): void {
    if (!this.selectedAlbum.titre || !this.selectedAlbum.artiste || !this.selectedAlbum.annee) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.selectedAlbum.id) {
      this.updateAlbum(this.selectedAlbum);
    } else {
      this.addAlbum(this.selectedAlbum);
    }
  }

  loadAlbums(): void {
    this.albumService.getAlbums(this.currentPage).subscribe({
      next: (data) => {
        this.albums = data.content; 
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des albums :', err);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAlbums();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAlbums();
    }
  }

  addAlbum(album: Album): void {
    this.albumService.createAlbum(album).subscribe({
      next: (createdAlbum) => {
        console.log("Album added successfully:", createdAlbum);
        this.loadAlbums();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error adding album:', err);
        alert('Error adding album. Please try again.');
      }
    });
  }

  updateAlbum(album: Album): void {
    if (album.id) {
      this.albumService.updateAlbum(album.id, album).subscribe({
        next: (updatedAlbum) => {
          console.log('Album mis à jour avec succès :', updatedAlbum);
          this.loadAlbums(); 
          this.closeModal();

        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'album :', err);
        },
      });
    }
  }

  deleteAlbum(id: string): void {
    if (confirm('Are you sure you want to delete this album ?')) {
      this.albumService.deleteAlbum(id).subscribe({
        next: () => {
          console.log('Album supprimé avec succès');
          this.loadAlbums();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l\'album :', err);
        },
      });
    }
  }

  selectAlbum(album: Album): void {
    this.selectedAlbum = { ...album };
  }

  clearSelection(): void {
    this.selectedAlbum = {
      id: '',
      titre: '',
      artiste: '',
      annee: 0
    };
  }

  openModal(): void {
    this.clearSelection();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.clearSelection();
  }
}
