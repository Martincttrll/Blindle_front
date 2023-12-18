import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/shared/models/group.model';
import { GroupService } from 'src/app/shared/services/group.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  groupToken: string = '';
  group?: Group;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.groupToken = params.get('token') ?? '';
      this.loadGroupData();
    });
  }

  loadGroupData(): void {
    this.groupService.getGroupByToken(this.groupToken).then((data) => {
      this.group = data;
    });
  }

  copyToken(groupTokenElement: HTMLDivElement) {
    const range = document.createRange();
    range.selectNode(groupTokenElement);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }
}
