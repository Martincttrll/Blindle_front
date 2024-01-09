import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Group } from "src/app/shared/models/group.model";
import { GroupService } from "src/app/shared/services/group.service";
import { HttpService } from "src/app/shared/services/http.service";

import { WebsocketService } from "src/app/shared/services/websocket.service";

@Component({
  selector: "app-lobby",
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
})
export class LobbyComponent {
  groupToken: string = "";
  group?: Group;
  readyPlayers: Array<number> = [];

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private http: HttpService,
    private ws: WebsocketService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupToken = params.get("token") ?? "";
      this.loadGroupData();
    });
  }
  ngOnDestroy(): void {}

  // leaveLobby(): void {
  //   this.groupService.leaveGroup(this.groupToken);
  // }

  loadGroupData(): void {
    this.groupService.getGroupByToken(this.groupToken).then((data) => {
      this.group = data;
      this.ws.linkChannelWithToken(this.group.token, this.group);
    });
  }

  copyToken(groupTokenElement: HTMLDivElement): void {
    const range = document.createRange();
    range.selectNode(groupTokenElement);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand("copy");
    window.getSelection()?.removeAllRanges();
  }

  setReady(): void {
    this.http
      .requestApi("/api/game/start/" + this.groupToken, "GET")
      .then((data) => {});
    /////Tous les joueurs soient prêt pour que la partie se lance.
    //   const id = this.http.user!.id;
    //   if (!this.readyPlayers.includes(id)) {
    //     this.readyPlayers.push(id);
    //     console.log("Pret!");
    //   } else {
    //     console.log("Joueur déjà prêt.");
    //   }
    //   this.groupService.getGroupByToken(this.groupToken).then((data) => {
    //     let group = data;
    //     if (this.readyPlayers.length === group.users.length) {
    //       this.http.requestApi("/api/game/start", "GET").then((data) => {
    //         console.log(data);
    //       });
    //     } else {
    //       console.log(
    //         "il manque " +
    //           (group.users.length - this.readyPlayers.length) +
    //           " avant de lancer la partie."
    //       );
    //     }
    // });
  }
}
