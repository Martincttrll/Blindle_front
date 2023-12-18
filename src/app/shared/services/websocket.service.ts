import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import {
  API_URL,
  MIX_PUSHER_APP_KEY,
  MIX_PUSHER_CLUSTER,
  MIX_PUSHER_FORCE_TLS,
  MIX_PUSHER_HOST,
  MIX_PUSHER_PORT,
  MIX_PUSHER_PORT_TLS,
  MIX_PUSHER_TRANSPORT,
} from '../../../environments/environment';
import { HttpService } from './http.service';
import { Group } from '../models/group.model';

// @ts-ignore
window.Pusher = require('pusher-js');

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private ws: any;
  private channel: any;

  constructor(public http: HttpService) {
    this.ws = this.initWs();
  }

  initWs(): any {
    return new Echo({
      broadcaster: 'pusher',
      cluster: MIX_PUSHER_CLUSTER,
      key: MIX_PUSHER_APP_KEY,
      wsHost: MIX_PUSHER_HOST,
      wsPort: MIX_PUSHER_PORT,
      wssPort: MIX_PUSHER_PORT_TLS,
      forceTLS: MIX_PUSHER_FORCE_TLS,
      disableStats: true,
      enabledTransports: MIX_PUSHER_TRANSPORT,
      authEndpoint: API_URL + '/broadcasting/auth',
      auth: {
        headers: {
          Authorization: 'Bearer ' + this.http.token,
        },
      },
    });
  }

  linkChannelWithToken(groupToken: string, group: Group) {
    this.channel = this.linkChannel(this.ws, groupToken);
    this.bindEvents(this.channel, group);
  }

  linkChannel(ws: any, groupToken: string) {
    return ws.private('Group.' + groupToken).pusher;
  }
  bindEvents(channel: any, group: Group) {
    channel.bind('joinGroup', (data: any) => {
      console.log(data.user.name + ' a rejoint le groupe.');
      group.users.push(data.user);
    });
    channel.bind('guessAnswer', (data: any) => {
      console.log('Une réponse a été enregistrée : ' + data);
    });
  }
}
