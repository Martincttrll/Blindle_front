import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Group } from 'src/app/shared/models/group.model';
import { GroupService } from 'src/app/shared/services/group.service';

import { WebsocketService } from 'src/app/shared/services/websocket.service';

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
    private groupService: GroupService,
    private ws: WebsocketService
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
      this.ws.linkChannelWithToken(this.group.token, this.group);
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
