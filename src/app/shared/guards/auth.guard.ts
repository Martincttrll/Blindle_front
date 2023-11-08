// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { HttpService } from '../services/http.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpService, private router: Router) {}

  checkLogin(): boolean {
    if (this.http.isLogged()) {
      return true;
    }
    return false;
  }

  async canActivate(): Promise<boolean> {
    if (!this.http.isInit) {
      let res = await this.http.initPromise.subscribe((res) => {
        if (res) {
          return this.checkLogin();
        }
        return false;
      });
    }
    console.log('Autorisation en cours...');
    return this.checkLogin();
  }
}
