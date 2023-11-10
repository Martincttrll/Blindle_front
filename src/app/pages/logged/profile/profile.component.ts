import { Component } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { AchievementService } from 'src/app/shared/services/achievement.service';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Group } from 'src/app/shared/models/group.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  achievements: Achievement[] = [];
  history: Group[] = [];

  user = this.http.user;
  nbLose: number = (this.user?.nbGame || 0) - (this.user?.nbWin || 0);
  constructor(
    private http: HttpService,
    private achievementService: AchievementService,
    private userService: UserService
  ) {
    this.achievementService.getAchievements().then((data) => {
      this.achievements = data;
    });

    this.userService.getHistory().then((data) => {
      this.history = this.formatDataFromHistory(data);
    });

    this;
  }

  hasProfilePic(): boolean {
    return !!this.user?.avatar;
  }
  hasAchievements(): boolean {
    return !!this.achievements;
  }
  //Formatage pour la liste d'historique
  formatDataFromHistory(history: Group[]): any[] {
    let datas: any[] = [];
    history.forEach((group) => {
      let formattedData = {
        leftData: group.name,
        centerData: group.winner,
        rightData: group.updated_at,
        isLeftDataPic: false,
        isRightDataDate: true,
      };

      datas.push(formattedData);
    });
    return datas;
  }

  ngOnInit() {}
}
