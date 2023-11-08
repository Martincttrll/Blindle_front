import { Component } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss'],
})
export class LoggedComponent {
  constructor(public apiService: HttpService) {}
  user = this.apiService.user;
  showModal = false;

  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}
