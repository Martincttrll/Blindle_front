import { Component } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { AchievementService } from 'src/app/shared/services/achievement.service';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Group } from 'src/app/shared/models/group.model';
import { Song } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  achievements: Achievement[] = [];
  history: Group[] = [];
  songs: Song[] = [];
  showModal = false;

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

    this.userService.getSongs().then((data) => {
      this.songs = this.formatDataFromSongs(data);
    });
  }

  refresh() {
    this.userService.refresh().then((data) => {
      console.log(data);
      if (data == "Les likes de l'utilisateurs ont bien été syncronisé.") {
        this.userService.getSongs().then((data) => {
          this.songs = this.formatDataFromSongs(data);
        });
      }
    });
  }

  hasProfilePic(): boolean {
    return !!this.user?.avatar;
  }

  //Formatage pour la liste d'historique
  formatDataFromHistory(history: Group[]): any[] {
    let datas: any[] = [];
    history.forEach((group) => {
      let formattedData = {
        leftData: group.name,
        centerData: 'Gagnant !',
        rightData: group.updated_at,
        isLeftDataPic: false,
        isRightDataDate: true,
        isRightDataLink: false,
      };

      datas.push(formattedData);
    });
    return datas;
  }

  //Formatage pour la liste de musiques
  formatDataFromSongs(songs: Song[]): any[] {
    let datas: any[] = [];
    songs.forEach((song) => {
      let formattedData = {
        leftData: song.title,
        centerData: song.artist,
        rightData: song.previewUrl,
        isLeftDataPic: false,
        isRightDataDate: false,
        isRightDataLink: true,
      };

      datas.push(formattedData);
    });
    return datas;
  }

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}
