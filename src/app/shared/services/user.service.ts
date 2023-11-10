import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  history: Group[] = [];

  constructor(public http: HttpService) {}

  async getHistory(): Promise<Group[]> {
    return this.http
      .requestApi('/api/user/history/' + this.http.user?.id, 'GET')
      .then((res) => {
        this.history = res;
        return this.history;
      });
  }
}
