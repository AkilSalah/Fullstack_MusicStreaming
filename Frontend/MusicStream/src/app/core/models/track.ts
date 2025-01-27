export interface Track {
  id: string;
  titre: string;
  artiste?: string;
  description?: string;
  date: Date;
  duree?: number;
  category: MusicCategory;
  audioFile: string;
  imageUrl?: string;
  imageFile?: Blob; 
  albumId : string;
}

export enum MusicCategory {
  POP = 'pop',
  ROCK = 'rock',
  RAI = 'rai',
  RAP = 'rap',
  CHAABI = 'cha3bi',
  OTHER = 'other'
}

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}