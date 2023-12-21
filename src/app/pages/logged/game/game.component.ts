import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Group } from "src/app/shared/models/group.model";
import { Song } from "src/app/shared/models/song.model";
import { User } from "src/app/shared/models/user.model";
import { GroupService } from "src/app/shared/services/group.service";
import { HttpService } from "src/app/shared/services/http.service";
import { WebsocketService } from "src/app/shared/services/websocket.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  @ViewChild("audioPlayer") audioPlayer!: ElementRef;
  guessTitle: number = 200;
  guessArtist: number = 200;
  groupToken: string = "";
  currentSong?: any;
  isUrlReady: boolean = false;
  group?: Group;
  constructor(
    private ws: WebsocketService,
    private http: HttpService,
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupToken = params.get("token") ?? "";
    });
    this.loadGroupData();

    this.ws.guessAnswer$.subscribe((guessAnswer) => {
      this.handleGuessResponse(guessAnswer);
    });

    this.ws.newRandomSong$.subscribe((song) => {
      this.handleNewRandomSong(song);
    });
  }

  loadGroupData(): void {
    this.groupService.getGroupByToken(this.groupToken).then((data) => {
      this.group = data;
      // this.ws.linkChannelWithToken(this.group.token, this.group);
    });
  }

  getRandomTrack() {
    this.http
      .requestApi("/api/game/random-song/" + this.groupToken, "GET")
      .then((data) => {});
    ///Envoyé via websockets
  }

  submitGuess(input: any) {
    const guess = input.value;
    console.log(guess);
    input.value = "";
    this.http.requestApi("/api/game/try", "POST", {
      input: guess,
      player_id: this.http.user!.id,
      title_points: this.guessTitle,
      group_token: this.groupToken,
      artist_points: this.guessArtist,
      song_id: this.currentSong.id,
    });
  }

  handleGuessResponse(guessAnswer: any) {
    const guessType = guessAnswer.datas.original.guess;
    switch (guessType) {
      case "artist":
        console.log(guessAnswer);
        this.getRandomTrack();
        break;

      case "title":
        console.log(guessAnswer);
        this.getRandomTrack();
        break;

      case null:
        console.log(guessAnswer);
        break;

      default:
        console.log("Pas trouvé");
    }
  }

  handleNewRandomSong(song: any) {
    this.currentSong = song[0].original.song;
    console.log(this.currentSong.id);
    this.isUrlReady = true;
    this.playAudio();
  }
  playAudio() {
    if (this.isUrlReady) {
      const audioPlayer = this.audioPlayer.nativeElement as HTMLAudioElement;
      if (audioPlayer) {
        audioPlayer.volume = 0.3;
        audioPlayer.load();
        audioPlayer.play();
      }
    }
  }
}
