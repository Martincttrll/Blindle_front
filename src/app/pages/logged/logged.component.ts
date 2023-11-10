import { Component } from '@angular/core';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss'],
})
export class LoggedComponent {
  showModal = false;

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}
