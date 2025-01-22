import { Component } from '@angular/core';
import { AlbumService } from '../../core/services/album.service';
import { Album } from '../../core/models/album';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent {
  albums: Album[] = [];
  currentPage = 0;
  totalPages = 0;

  constructor(private albumService: AlbumService) {}

  ngOnInit(): void {
    this.loadAlbums();
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
}
