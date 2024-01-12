import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { GroupService } from "src/app/shared/services/group.service";
import { HttpService } from "src/app/shared/services/http.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  showCreateGroup: boolean = false;
  errorJoinGroup?: string;
  constructor(
    public groupService: GroupService,
    private router: Router,
    private http: HttpService
  ) {}

  sendCloseModal() {
    this.closeModalEvent.emit();
  }
  changeModal() {
    this.showCreateGroup = true;
  }

  joinGroup(inputElement: any) {
    const grouptoken = inputElement.value;
    this.groupService
      .joinGroup(grouptoken)
      .then((data) => {
        console.log("Vous avez rejoin le groupe : " + data.name);
        this.router.navigate(["/group", data.token]);
        this.sendCloseModal();
      })
      .catch((error) => {
        console.error(error);
        this.errorJoinGroup = "Code invalide.";
      });
  }

  createGroup(inputElement: any) {
    const groupname = inputElement.value;
    this.groupService.createGroup(groupname).then((data) => {
      this.router.navigate(["/group", data.token]);
      this.sendCloseModal();
    });
    this.createGroupAchievement();
  }

  async createGroupAchievement() {
    const userAchievement = await this.http.requestApi(
      "/api/achievement/",
      "GET"
    );
    //First win
    const hasCreator = userAchievement?.achievements?.some(
      (achievement: any) => achievement.id === 1
    );

    if (!hasCreator) {
      this.http.requestApi("/api/achievement/attach/3", "POST").then((data) => {
        console.log(data);
      });
    }
  }
}
