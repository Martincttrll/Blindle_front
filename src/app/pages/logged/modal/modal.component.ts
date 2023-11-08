import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  sendCloseModal() {
    this.closeModalEvent.emit();
  }
}
