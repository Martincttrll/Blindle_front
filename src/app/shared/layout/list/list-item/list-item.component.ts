import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent {
  @Input() index!: number;
  @Input() isLeftDataPic!: boolean;
  @Input() isRightDataDate!: boolean;
  @Input() leftData!: string;
  @Input() centerData!: string;
  @Input() rightData!: string;

  isEven(): boolean {
    return this.index % 2 == 0;
  }
}
