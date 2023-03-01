import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class FireguardGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in']);
      this.snackBar.open(
        'You are not authorized to view this page',
        'Auth Error',
        { duration: 2 * 1000 }
      );
    }
    return true;
  }
}
