import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  chatMessages: {
    user: string;
    message: string;
    status: string | undefined;
  }[] = [];

  groupToken: string = "";
  currentSong?: any;
  showCurrentSong: boolean = false;
  isUrlReady: boolean = false;
  group?: Group;

  nbManche: number = 5;
  currentManche: number = 0;
  hasGameEnded: boolean = false;
  winner?: User;
  constructor(
    private ws: WebsocketService,
    private http: HttpService,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.nbManche = this.ws.nbManche;
    console.log(this.nbManche);
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

  ngOnDestroy(): void {
    this.groupService.leaveGroup(this.groupToken);
  }

  loadGroupData(): void {
    this.groupService.getGroupByToken(this.groupToken).then((data) => {
      this.group = data;
      this.group.users.forEach((user) => {
        user.points = 0;
        user.alreadyGuess = [];
      });
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
    const player = this.group?.users.find(
      (user) => user.id === this.http.user!.id
    );
    const guess = input.value;
    input.value = "";
    this.http.requestApi("/api/game/try", "POST", {
      input: guess,
      player_id: this.http.user!.id,
      group_token: this.groupToken,
      title_points: this.guessTitle,
      artist_points: this.guessArtist,
      song_id: this.currentSong.id,
      alreadyGuess: player!.alreadyGuess,
    });
  }

  handleGuessResponse(guessAnswer: any) {
    const data = guessAnswer.datas.original;

    const userPoints = data.user_points ?? 0;

    const player = this.group?.users.find((user) => user.id === data.player);

    let guessStatus = undefined;

    if (data.guess === "artist" || data.guess === "title") {
      if (player) {
        player.points += userPoints;
      }

      if (data.guess === "artist") {
        this.guessArtist = data.artist_points;
        player?.alreadyGuess?.push("artist");
      } else if (data.guess === "title") {
        this.guessTitle = data.title_points;
        player?.alreadyGuess?.push("title");
      }

      guessStatus = "found";
    } else {
      console.log("Pas trouvé");
    }

    const playerName = player?.name || "Inconnu";
    const message = data.message;

    this.chatMessages.push({
      user: playerName,
      message: message,
      status: guessStatus,
    });

    if (this.chatMessages.length > 8) {
      this.chatMessages.shift();
    }
  }

  handleNewRandomSong(song: any) {
    ///Pour attendre que les infos du groupes remontent bien (a changer pour un observer/subscriber)
    setTimeout(() => {
      this.guessArtist = 200;
      this.guessTitle = 200;
      this.group!.users.forEach((user) => {
        user.alreadyGuess = [];
      });
      this.currentSong = song[0].original.song;
      console.log(this.currentSong.id);
      this.isUrlReady = true;
      this.playAudio();
    }, 1000);
  }

  playAudio() {
    console.log("Current manche : " + this.currentManche);
    if (this.currentManche < this.nbManche) {
      if (this.isUrlReady) {
        const audioPlayer = this.audioPlayer.nativeElement as HTMLAudioElement;
        if (audioPlayer) {
          audioPlayer.volume = 0.3;
          audioPlayer.load();
          audioPlayer.play();
          audioPlayer.addEventListener("ended", () => {
            this.http
              .requestApi("/api/song/" + this.currentSong.id, "GET")
              .then((data) => {
                this.currentSong.title = data.title;
                this.currentSong.artist = data.artist;
                this.showCurrentSong = true;
              });
            setTimeout(() => {
              this.showCurrentSong = false;
              this.currentSong.title = undefined;
              this.currentSong.artist = undefined;
              this.getRandomTrack();
              this.currentManche++;
            }, 4000);
          });
        }
      }
    } else {
      console.log("Jeu fini, le nombre maximal de manche a été atteint");
      this.handleEndOfGame();
    }
  }

  sortedUsers(): User[] {
    return (
      this.group?.users
        .slice()
        .sort((a, b) => (b.points || 0) - (a.points || 0)) || []
    );
  }

  getPodiumClass(index: number): string {
    switch (index) {
      case 0:
        return "first-place";
      case 1:
        return "second-place";
      case 2:
        return "third-place";
      default:
        return "";
    }
  }

  handleEndOfGame() {
    this.hasGameEnded = true;

    const sortedUsers = this.sortedUsers();

    if (sortedUsers.length > 0 && sortedUsers[0].points !== undefined) {
      this.winner = sortedUsers[0];

      this.http
        .requestApi("/api/game/set-winner/", "POST", {
          winner_id: this.winner.id,
          group_id: this.group?.id,
        })
        .then((data) => {
          console.log(data);
        });
      this.handleAchievementsLinking(this.winner.id);
    } else {
      console.log("Aucun utilisateur avec des points trouvé");
    }
  }

  redirectToHome() {
    this.router.navigate([""]);
  }
  attachAchievement(id_achievement: number) {
    this.http
      .requestApi("/api/achievement/attach/" + id_achievement, "POST")
      .then((data) => {
        console.log(data.message);
      });
  }
  hasPlayerWith300PointsAdvantage(): boolean {
    const sortedUsers = this.sortedUsers();

    if (sortedUsers.length >= 2) {
      const topPlayer = sortedUsers[0];
      const secondPlayer = sortedUsers[1];
      return (topPlayer.points || 0) >= (secondPlayer.points || 0) + 300;
    }
    return false;
  }
  async handleAchievementsLinking(winner_id: number) {
    try {
      if (winner_id === this.http.user?.id) {
        const userAchievement = await this.http.requestApi(
          "/api/achievement/",
          "GET"
        );
        //First win
        const hasFirstWin = userAchievement?.achievements?.some(
          (achievement: any) => achievement.id === 1
        );

        if (!hasFirstWin) {
          this.http
            .requestApi("/api/achievement/attach/1", "POST")
            .then((data) => {
              console.log(data);
            });
        }
        //Win with more than 300pts than ur opponent
        const hasDominateur = userAchievement?.achievements?.some(
          (achievement: any) => achievement.id === 2
        );

        if (!hasDominateur && this.hasPlayerWith300PointsAdvantage()) {
          this.http
            .requestApi("/api/achievement/attach/2", "POST")
            .then((data) => {
              console.log(data);
            });
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des réalisations de l'utilisateur :",
        error
      );
    }
  }
}
