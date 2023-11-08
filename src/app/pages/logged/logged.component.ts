import { Component } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.scss'],
})
export class LoggedComponent {
  constructor(public apiService: HttpService) {
    // const response_type = 'code';
    // const client_id = '47deb21a931a43109a5b20a91bd48a28';
    // const scope = 'user-library-read playlist-read-private';
    // const redirect_uri = 'http://localhost:4200/logged/';
    // const state = 'your_state';
    // // Génération de l'URL d'autorisation Spotify
    // const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=${response_type}&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
    // // Redirection côté client vers l'URL d'autorisation
    // window.location.href = authorizationUrl;
  }
  user = this.apiService.user;
}
