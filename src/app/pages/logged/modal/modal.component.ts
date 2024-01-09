import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { GroupService } from "src/app/shared/services/group.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  showCreateGroup: boolean = false;
  errorJoinGroup?: string;
  constructor(public groupService: GroupService, private router: Router) {}

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
  }
}
