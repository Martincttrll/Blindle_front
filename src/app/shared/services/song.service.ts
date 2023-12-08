import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(public http: HttpService) {}
  userSongs: Song[] = [];
  ////////IL FAUT CREER LENDPOINT DANS LE BACK
  async getAchievements(): Promise<Song[]> {
    return this.http.requestApi('/api/songs', 'GET').then((res) => {
      this.userSongs = res.songs;
      return this.userSongs;
    });
  }
}
