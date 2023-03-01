import { Injectable } from '@angular/core';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userData: any;
  contactsArray: Record<string, string>[] = [];
  email: string = '';

  private contactsSource = new BehaviorSubject<any>([]);
  public contactsData$ = this.contactsSource.asObservable();

  constructor(private router: Router, private snackBar: MatSnackBar) {
    firebase.initializeApp(environment.firebase);
    this.email = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData')!)['email']
      : '';
  }

  async SignIn(email: string, password: string) {
    try {
      let loginAction = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      this.router.navigate(['/home']);

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
      this.email = this.userData['email'];
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

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('userData')!);
    return user !== null ? true : false;
  }

  logout() {
    localStorage.clear();
    this.email = '';
    this.userData = null;
    this.router.navigate(['/login']);
  }

  private updateContactsData(data: any) {
    this.contactsSource.next(data);
  }

  async getContacts() {
    let getResp = await firebase.firestore().collection('users');
    const querySnapshot = await getResp.get();
    querySnapshot.forEach((doc) => {
      if (doc.id == this.email) {
        let tempArr = doc.data()['conts'] || [];
        this.contactsArray = [...(tempArr as [])];
        this.updateContactsData(doc.data()['conts']);
      }
    });
  }

  async saveContact(
    firstname: string,
    lastname: string,
    email: string,
    mobile: string
  ) {
    const user = {
      firstname,
      lastname,
      email,
      mobile: mobile.toString(),
    };

    let saveResp = await firebase
      .firestore()
      .collection('users')
      .doc(this.email);

    let tempArrx = this.contactsArray.filter(
      (contact) =>
        contact['firstname'].toLowerCase() == user['firstname'].toLowerCase()
    );

    let tempArry = this.contactsArray.filter(
      (contact) => contact['mobile'] == user['mobile']
    );

    if (tempArrx.length !== 0 || tempArry.length !== 0) {
      this.snackBar.open('Contact Name/Mobile already exists', 'Failure', {
        duration: 2 * 1000,
      });
    } else {
      let tempArr = [...this.contactsArray, user];
      await saveResp.set({ conts: tempArr });
      this.getContacts();
      this.snackBar.open('Contact saved', 'Success', {
        duration: 2 * 1000,
      });
    }
  }

  async updateContact(
    firstname: string,
    lastname: string,
    email: string,
    mobile: string,
    oldMobile: string
  ) {
    const user = {
      firstname,
      lastname,
      email,
      mobile,
    };

    let saveResp = await firebase
      .firestore()
      .collection('users')
      .doc(this.email);

    this.contactsArray.map((contact, index) => {
      if (contact['mobile'] == oldMobile) {
        this.contactsArray.splice(index, 1, user);
      }
    });

    await saveResp.set({ conts: this.contactsArray });
    this.getContacts();
    this.snackBar.open('Contact updated', 'Success', {
      duration: 2 * 1000,
    });
  }

  async deleteContact(user: Record<string, string>) {
    let saveResp = await firebase
      .firestore()
      .collection('users')
      .doc(this.email);

    this.contactsArray.map((contact, index) => {
      if (contact['mobile'] == user['mobile']) {
        this.contactsArray.splice(index, 1);
      }
    });

    await saveResp.set({ conts: this.contactsArray });
    this.getContacts();
    this.snackBar.open('Contact deleted', 'Success', {
      duration: 2 * 1000,
    });
  }
}
