import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(public http: HttpService) {}

  async createGroup(groupname: string): Promise<Group[]> {
    return this.http
      .requestApi('/api/group/store', 'POST', { name: groupname })
      .then((res) => {
        return res;
      });
  }
}
