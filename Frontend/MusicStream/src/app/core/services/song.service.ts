import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private adminBaseUrl = "http://localhost:8080/api/admin/songs"
  private userBaseUrl = "http://localhost:8080/api/user/songs"

  constructor(private http : HttpClient) { }

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

  createSong(song: Track): Observable<Track> {
    const { id, ...songWithoutId } = song;
    return this.http.post<Track>(`${this.adminBaseUrl}`, songWithoutId);
  }

  updateSong(id: string, song: Track): Observable<Track> {
    return this.http.put<Track>(`${this.adminBaseUrl}/${id}`, song);
  }

  deleteSong(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminBaseUrl}/${id}`);
  }

}
