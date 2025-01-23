import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private adminBaseUrl = "http://localhost:8080/api/admin";
  private userBaseUrl = "http://localhost:8080/api/user";
  constructor(private http : HttpClient) {}

  getAlbums(page : number = 0 , size : number = 6): Observable<any>{
    const params = new HttpParams().set('page',page.toString())
    .set('size',size.toString());
    return this.http.get(`${this.userBaseUrl}/albums`,{params})
  } 

  searchAlbumsByTitle(titre: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('titre', titre)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get(`${this.userBaseUrl}/albums/search/title`, { params });
  }

  getAlbumById(id: string): Observable<any> {
    return this.http.get(`${this.userBaseUrl}/albums/${id}`);
  }

  createAlbum(album: Album): Observable<Album> {
    const { id, ...albumWithoutId } = album;
    return this.http.post<Album>(`${this.adminBaseUrl}/albums`, albumWithoutId);
  }

  updateAlbum(id: string, album: Album): Observable<any> {
    return this.http.put(`${this.adminBaseUrl}/albums/${id}`, album);
  }

  deleteAlbum(id: string): Observable<any> {
    return this.http.delete(`${this.adminBaseUrl}/albums/${id}`,{responseType : 'text'});
  }


}
