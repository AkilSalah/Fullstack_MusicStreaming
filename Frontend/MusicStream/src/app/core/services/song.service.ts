import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private adminBaseUrl = "http://localhost:8080/api/admin/songs"
  private userBaseUrl = "http://localhost:8080/api/user/songs"

  constructor(private http : HttpClient) { }

  getSongById(id: string): Observable<any> {
    return this.http.get(`${this.userBaseUrl}/${id}`)
  }

  getAllSongs(page = 0 ,size = 6 ,sort = 'titre.asc') : Observable<any>{
    let params = new HttpParams()
    .set('page' , page.toString())
    .set('size', size.toString())
    .set('sort',sort)
    return this.http.get(`${this.userBaseUrl}`,{params});
  }
  
  searchSongsByTitle(titre: string, page = 0, size = 10, sort = 'titre,asc'): Observable<any> {
    let params = new HttpParams()
      .set('titre', titre)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get(`${this.userBaseUrl}/search`, { params });
  }

  getSongsByAlbum(albumId: string, page = 0, size = 10, sort = 'trackNumber,asc'): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get(`${this.userBaseUrl}/album/${albumId}`, { params });
  }

  createSong(song: Track, audioFile: File): Observable<Track> {
    const formData = new FormData();
    
    formData.append('titre', song.titre);
    const formattedDate = new Date(song.date).toISOString().split('T')[0];
    formData.append('date', formattedDate);
    formData.append('category', song.category);
    formData.append('description', song.description || '');
    formData.append('albumId', song.albumId || '');
    
    formData.append('audioFile', audioFile, audioFile.name);

    console.log('FormData contents:');
    formData.forEach((value, key) => {
        console.log(`${key}:`, value);
    });

    const headers = new HttpHeaders();    
    return this.http.post<Track>(`${this.adminBaseUrl}`, formData, { headers })
        .pipe(
            catchError(error => {
                console.error('Server error:', error);
                return throwError(() => new Error('Failed to upload song. Please try again.'));
            })
        );
  }

  
  updateSong(id: string, song: Track): Observable<Track> {
    return this.http.put<Track>(`${this.adminBaseUrl}/${id}`, song);
  }

  deleteSong(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

}
