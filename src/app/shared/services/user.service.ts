import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  history: Group[] = [];
  songs: Song[] = [];

  constructor(public http: HttpService) {}

  async getHistory(): Promise<Group[]> {
    return this.http
      .requestApi('/api/user/history/' + this.http.user?.id, 'GET')
      .then((res) => {
        this.history = res;
        return this.history;
      });
  }

  async getSongs(): Promise<Song[]> {
    return this.http
      .requestApi('/api/user/songs/' + this.http.user?.id, 'GET')
      .then((res) => {
        this.songs = res;
        return this.songs;
      });
  }
  async refresh(): Promise<string> {
    return this.http
      .requestApi('/api/user/refresh/' + this.http.user?.id, 'GET')
      .then((res) => {
        return res.message;
      });
  }
}
