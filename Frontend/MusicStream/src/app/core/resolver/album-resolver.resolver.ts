import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { SongService } from '../services/song.service';
import { Track } from '../../core/models/track';
import { data } from 'autoprefixer';

@Injectable({
  providedIn: 'root'
})
export class AlbumResolver implements Resolve<{ content: Track[], totalElements: number }> {
  constructor(private songService: SongService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{content :Track[],totalElements : number}> {
    const albumId = route.paramMap.get('id');
    if (!albumId) {
      throw new Error('Album ID is missing.');
    }
    return this.songService.getSongsByAlbum(albumId, 0, 10).pipe(
      map(data => ({
        content: data.content,
        totalElements : data.totalElements
      }))
    ); 
  }
}