import { Component } from '@angular/core';
import { API_URL } from 'src/environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor() {}
  loginBtn() {
    window.location.href = API_URL + '/auth/redirect';
  }
}
