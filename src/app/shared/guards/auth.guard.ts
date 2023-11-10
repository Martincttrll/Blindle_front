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

  private url: string = '';

  private authState(): boolean {
    if (this.isLoginOrRegister()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

  private noAuthState(): boolean {
    if (this.isLoginOrRegister()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
  private isLoginOrRegister(): boolean {
    if (this.url.includes('/login')) {
      return true;
    }
    return false;
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.http.isInit) {
      let res = await this.http.initPromise.subscribe((res) => {
        if (res) {
          return this.checkLogin(state);
        }
        return false;
      });
      if (!res) {
        return false;
      }
    }
    return this.checkLogin(state);
  }

  checkLogin(state: RouterStateSnapshot): boolean {
    this.url = state.url;
    if (this.http.isLogged()) {
      return this.authState();
    }
    return this.noAuthState();
  }
}
