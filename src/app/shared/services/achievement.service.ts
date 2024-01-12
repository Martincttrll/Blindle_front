import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Achievement } from '../models/achievement.model';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  achievements: Achievement[] = [];

  constructor(public http: HttpService) {}

  async getAchievements(): Promise<Achievement[]> {
    return this.http.requestApi('/api/achievement', 'GET').then((res) => {
      this.achievements = res.achievements;
      return this.achievements;
    });
  }
}
