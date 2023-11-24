import { Component, EventEmitter, Output } from '@angular/core';
// import { GroupService } from 'src/app/shared/services/group.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  // showCreateGroup: boolean = false;
  // constructor(public group: GroupService) {}
  // @Output() closeModalEvent = new EventEmitter<void>();
  // sendCloseModal() {
  //   this.closeModalEvent.emit();
  // }
  // changeModal() {
  //   this.showCreateGroup = true;
  // }
  // createGroup(inputElement: any) {
  //   // document.getElementById('group-name').value;
  //   const groupname = inputElement.value;
  //   this.group.createGroup(groupname).then((data) => {
  //     console.log(data);
  //   });
  // }
  // copyInputMessage(inputElement: any) {
  //   inputElement.select();
  //   document.execCommand('copy');
  //   inputElement.setSelectionRange(0, 0);
  // }
}
