import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, switchMap } from 'rxjs';
import * as PlayerActions from '../store/actions/audio-player.action';
import * as PlayerSelectors from '../store/selectors/audio-player.selectors';
import { Track } from '../../core/models/track';
import { PlayerState, PlayerStateModel } from '../store/reducers/trackPlayer.reducer';
import { SongService } from '../../core/services/song.service';
import { AlbumService } from '../../core/services/album.service';


@Component({
  selector: "app-track",
  templateUrl: "./track.component.html",
})
export class TrackComponent implements OnInit, OnDestroy {
  @ViewChild("audioPlayer") audioPlayer!: ElementRef<HTMLAudioElement>;

  track: Track | null = null;
  album: any = {};
  playerStatus$: Observable<PlayerState>;
  playerError$: Observable<string | null>;
  currentTrack$: Observable<Track | null>;
  audioUrl: string | null = null;
  trackId: string | null = null;

  isPlaying = false;
  isMuted = false;
  volume = 1;
  currentTime = "00:00";
  duration = "00:00";
  progress = 0;

  tracks: Track[] = [];
  currentTrackIndex = 0;
  private subscription = new Subscription();

  constructor(
    private albumService: AlbumService,
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongService,
    private store: Store<{ player: PlayerStateModel }>,
  ) {
    this.playerStatus$ = this.store.select(PlayerSelectors.selectPlayerStatus);
    this.playerError$ = this.store.select(PlayerSelectors.selectPlayerError);
    this.currentTrack$ = this.store.select(PlayerSelectors.selectCurrentTrack);
  }

  ngOnInit(): void {
    this.trackId = this.route.snapshot.paramMap.get("id");
    if (this.trackId) {
      this.loadSongAndRelated(this.trackId);
    }

    this.subscription.add(
      this.currentTrack$.subscribe(track => {
        if (track) {
          this.track = track;
          this.audioUrl = `http://localhost:8080/uploads/${track.audioFile}`;
          this.loadAudio();
        }
      })
    );

    if (this.audioPlayer?.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      audio.addEventListener('error', (event) => {
        console.error("Audio error:", audio.error);
      });
      audio.addEventListener('stalled', () => {
        console.error("Audio stalled: Network issues or server problems.");
      });
      audio.addEventListener('abort', () => {
        console.error("Audio loading aborted.");
      });
    }
  }

  loadSongAndRelated(trackId: string) {
    this.songService.getSongById(trackId).pipe(
      switchMap(song => {
        this.store.dispatch(PlayerActions.loadSuccess({ track: song }));
        return this.songService.getSongsByAlbum(song.albumId);
      })
    ).subscribe({
      next: (response) => {
        this.tracks = response.content || []; 
        this.currentTrackIndex = this.tracks.findIndex(t => t.id === trackId);
      },
      error: (err) => {
        console.error("Error loading songs", err);
        this.store.dispatch(PlayerActions.loadError({ error: err.message }));
      }
    });
  }
  
  

  loadSongById(id: string) {
    this.stopCurrentAudio();
    this.songService.getSongById(id).subscribe({
      next: (data) => {
        this.track = data;
        this.audioUrl = `http://localhost:8080/uploads/${data.audioFile}`;
        this.store.dispatch(PlayerActions.loadSuccess({ track: data }));
        this.loadAudio();
      },
      error: (err) => {
        console.error("Error loading track", err);
        this.store.dispatch(PlayerActions.loadError({ error: err.message }));
      },
    });
  }

  loadAudio() {
    if (this.audioUrl && this.audioPlayer?.nativeElement) {
      const audioElement = this.audioPlayer.nativeElement;
      audioElement.src = this.audioUrl;
      audioElement.load();
      audioElement.oncanplay = () => {
        console.log("Audio loaded successfully");
        this.duration = this.formatTime(audioElement.duration);
      };
    }
  }

  previousTrack() {
    if (this.tracks.length > 0 && this.currentTrackIndex > 0) {
      this.currentTrackIndex--;
      const previousTrack = this.tracks[this.currentTrackIndex];
      this.navigateToTrack(previousTrack.id);
    }
  }
  
  nextTrack() {
    if (this.tracks.length > 0 && this.currentTrackIndex < this.tracks.length - 1) {
      this.currentTrackIndex++;
      const nextTrack = this.tracks[this.currentTrackIndex];
      this.navigateToTrack(nextTrack.id);
    }
  }
  
  private navigateToTrack(trackId: string) {
    this.stopCurrentAudio();
    this.router.navigate(["/track", trackId]);
    this.loadSongById(trackId);
  }

  togglePlay(): void {
    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;

    if (audio.paused) {
      audio.play();
      this.store.dispatch(PlayerActions.play());
      this.isPlaying = true;
    } else {
      audio.pause();
      this.store.dispatch(PlayerActions.pause());
      this.isPlaying = false;
    }
  }

  stopCurrentAudio() {
    if (this.audioPlayer?.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      audio.pause();
      audio.currentTime = 0;
      this.store.dispatch(PlayerActions.stop());
      this.isPlaying = false;
    }
  }

  toggleMute() {
    if (!this.audioPlayer?.nativeElement) return;
    this.audioPlayer.nativeElement.muted = !this.audioPlayer.nativeElement.muted;
    this.isMuted = this.audioPlayer.nativeElement.muted;
  }

  updateVolume(event: Event) {
    if (!this.audioPlayer?.nativeElement) return;
    const value = (event.target as HTMLInputElement).value;
    this.audioPlayer.nativeElement.volume = Number(value);
    this.volume = Number(value);
  }

  onTimeUpdate() {
    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;
    this.currentTime = this.formatTime(audio.currentTime);
    this.progress = (audio.currentTime / audio.duration) * 100;
  }

  onLoadedMetadata() {
    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;
    this.duration = this.formatTime(audio.duration);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  seekTo(event: MouseEvent) {
    if (!this.audioPlayer?.nativeElement) return;
    const audio = this.audioPlayer.nativeElement;
    const progressBar = event.target as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / rect.width;
    audio.currentTime = audio.duration * percentage;
  }

  onError() {
    const audio = this.audioPlayer.nativeElement;
    console.error("Error occurred while playing the audio:", audio.error);
    this.store.dispatch(PlayerActions.loadError({ error: "An error occurred while playing the audio." }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.audioUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(this.audioUrl);
    }
    this.stopCurrentAudio();
  }
}