import { Component } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { AchievementService } from 'src/app/shared/services/achievement.service';
import { Achievement } from 'src/app/shared/models/achievement.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  achievements: Achievement[] = [];

  constructor(
    private http: HttpService,
    private achievementService: AchievementService
  ) {
    this.achievementService.getAchievements().then((data) => {
      this.achievements = data;
    });
  }
  user = this.http.user;
  nbLose: number = (this.user?.nbGame || 0) - (this.user?.nbWin || 0);

  hasProfilePic(): boolean {
    return !!this.user?.avatar;
  }
  hasAchievements(): boolean {
    return !!this.achievements;
  }

  ngOnInit() {}
}
