import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  userContacts: Record<string, string>[] = [];
  displayMode: number = 1;

  cardColumns$!: Observable<number>;
  contactsData$!: Observable<any>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private firebaseService: FirebaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.firebaseService.getContacts();
    // this.contactsData$ = this.firebaseService.contactsData$
    this.firebaseService.contactsData$.subscribe((resp) => {
      console.log(resp);
      this.userContacts = resp;
      this.userContacts = this.userContacts
        ? this.userContacts.sort((a, b) => {
            const nameA = a['firstname'].toUpperCase(); // convert name to uppercase
            const nameB = b['firstname'].toUpperCase(); // convert name to uppercase
            if (nameA < nameB) {
              return -1; // nameA comes before nameB in alphabetical order
            }
            if (nameA > nameB) {
              return 1; // nameA comes after nameB in alphabetical order
            }
            return 0; // nameA and nameB are equal
          })
        : [];
    });

    this.cardColumns$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(({ matches }) => {
          return matches ? 1 : 4;
        })
      );
  }

  onDisplayModeChange(mode: number): void {
    this.displayMode = mode;
    // this.firebaseService.saveContact();
  }

  openModal() {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { dialogTitle: 'Add Contact' },
    });
  }

  editContact(user: any) {
    console.log(user);

    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { dialogTitle: 'Edit Contact', dialogData: user },
    });
  }

  deleteContact(user: any) {
    console.log(user);
  }
}
