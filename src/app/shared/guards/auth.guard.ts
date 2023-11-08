import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private http: HttpService, private router: Router) {}

  canActivate(): boolean {
    if (this.http.isInit) {
      if (this.http.user) {
        return true; // L'utilisateur est connecté, la navigation est autorisée
      } else {
        this.router.navigate(['/login']); // L'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
        return false; // La navigation est bloquée
      }
      // return true;
    } else {
      return false;
    }
  }
}
