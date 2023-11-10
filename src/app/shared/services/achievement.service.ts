import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Achievement } from '../models/achievement.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  constructor(public http: HttpService) {}

  achievements: Achievement[] = [];

  async getAchievements(): Promise<Achievement[]> {
    return this.http.requestApi('/api/achievement', 'GET').then((res) => {
      this.achievements = res.achievements;
      return this.achievements;
    });
  }
}
