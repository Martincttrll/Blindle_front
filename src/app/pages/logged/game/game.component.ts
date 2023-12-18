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
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
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
    console.log(guess);
    input.value = '';
    this.http
      .requestApi('/api/game/try', 'POST', {
        input: guess,
        player_id: this.http.user!.id,
        title_points: this.guessTitle,
        group_token: this.groupToken,
        artist_points: this.guessArtist,
        song_id: this.currentSong.id,
      })
      .then((data) => {
        console.log(data);
        let message = data.message;
        switch (data.guess) {
          case 'artist':
            console.log('Option 1 sélectionnée');
            this.startManche();
            break;

          case 'title':
            console.log('Option 2 sélectionnée');
            this.startManche();
            break;

          case null:
            console.log('Option 3 sélectionnée');
            break;

          default:
            console.log('Pas trouvé');
        }
      });
  }

  playAudio() {
    if (this.isUrlReady) {
      const audioPlayer = this.audioPlayer.nativeElement as HTMLAudioElement;
      if (audioPlayer) {
        audioPlayer.load();
        audioPlayer.play();
      }
    }
  }
}
