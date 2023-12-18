import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Song } from 'src/app/shared/models/song.model';
import { User } from 'src/app/shared/models/user.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  constructor(
    private ws: WebsocketService,
    private http: HttpService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupToken = params.get('token') ?? '';
    });
    this.startManche();
  }

  guessTitle: number = 200;
  guessArtist: number = 200;
  groupToken: string = '';
  currentSong?: any;
  isUrlReady: boolean = false;

  startManche() {
    ////Verif si tout le monde pret
    this.getRandomTrack();
  }

  getRandomTrack() {
    this.http
      .requestApi('/api/game/random-song/' + this.groupToken, 'GET')
      .then((data) => {
        this.currentSong = data.song;
        console.log(this.currentSong);
        this.isUrlReady = true;
        this.playAudio();
      });
  }

  submitGuess(input: any) {
    const guess = input.value;
    this.http
      .requestApi('/api/game/try', 'POST', {
        input: guess,
        player_id: this.http.user!.id,
        title_points: this.guessTitle,
        artist_points: this.guessArtist,
        song_id: this.currentSong.id,
      })
      .then((data) => {
        console.log(data);
      });
  }
  ////NE marche pas, il faut déclanche l'audio automatiquement
  playAudio() {
    if (this.isUrlReady) {
      const audioPlayer = document.getElementById(
        'audioPlayer'
      ) as HTMLAudioElement;
      console.log(audioPlayer);
      if (audioPlayer) {
        audioPlayer.play();
      }
    }
  }
}
