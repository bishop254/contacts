import { Injectable } from '@angular/core';

import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userData: any;

  constructor(private router: Router, private snackBar: MatSnackBar) {
    firebase.initializeApp(environment.firebase);
  }

  async SignIn(email: string, password: string) {
    try {
      let loginAction = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      this.router.navigate(['/users']);

      this.snackBar.open('Login Success', 'Success', {
        duration: 2 * 1000,
      });

      localStorage.setItem('userId', loginAction.user?.uid!);
      localStorage.setItem('token', loginAction.user?.refreshToken!);
      localStorage.setItem(
        'userData',
        JSON.stringify(loginAction.user?.providerData[0])
      );

      this.userData = loginAction.user;
    } catch (error) {
      this.snackBar.open('Login Failure/Invalid credentials', 'Failure', {
        duration: 2 * 1000,
      });
      this.snackBar.open(error as string, 'Failure', {
        duration: 2 * 1000,
      });
    }
  }

  async SignUp(email: string, password: string) {
    try {
      const registerResp = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      console.log(registerResp);

      this.router.navigate(['/sign-in']);

      this.snackBar.open('Registration Success', 'Success', {
        duration: 2 * 1000,
      });
    } catch (error) {
      this.snackBar.open('Registration Failure', 'Failure', {
        duration: 2 * 1000,
      });
      this.snackBar.open(error as string, 'Failure', {
        duration: 10 * 1000,
      });
    }
  }
}
