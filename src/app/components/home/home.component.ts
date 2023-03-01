import {
  Component,
  OnInit,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { Subscription } from 'rxjs';
import { ViewContactComponent } from '../view-contact/view-contact.component';
import { MatListOption } from '@angular/material/list';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChildren(MatListOption) contacts!: QueryList<MatListOption>;
  /** Based on the screen size, switch from standard to one column per row */
  userContacts: Record<string, string>[] = [];
  allContacts: Record<string, string>[] = [];

  displayMode: number = 1;

  cardColumns$!: Observable<number>;
  contactsData$!: Observable<any>;
  isMobile: boolean = false;
  value!: Event;

  private subs: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private firebaseService: FirebaseService,
    private dialog: MatDialog
  ) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnInit() {
    this.firebaseService.getContacts();
    this.contactsData$ = this.firebaseService.contactsData$;
    let x = this.firebaseService.contactsData$.subscribe((resp) => {
      this.userContacts = resp;
      this.allContacts = resp;
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

    this.subs.push(x);

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

  viewContact(user: Record<string, string>) {
    this.dialog.open(ViewContactComponent, {
      width: '400px',
      data: user,
    });
  }

  editContact(user: any) {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: { dialogTitle: 'Edit Contact', dialogData: user },
    });
  }

  deleteContact(user?: any) {
    let dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
    });

    let y = dialogRef.afterClosed().subscribe((resp) => {
      console.log(resp);
      if (resp == 1) {
        if (user == undefined) {
          const selectedOptions = this.contacts
            .filter((contact) => contact.selected)
            .map((contact) => contact.value);

          let contactsToDelete: Record<string, string>[] = [];

          selectedOptions.map((item) => {
            let contactItem = this.allContacts.filter(
              (contact) => contact['mobile'] == item
            );

            contactsToDelete.push(contactItem[0]);
          });

          contactsToDelete.forEach((contact) => {
            this.firebaseService.deleteContact(contact);
          });
        } else {
          this.firebaseService.deleteContact(user);
        }
      }
    });

    this.subs.push(y);
  }

  searchContact() {
    this.userContacts = [...this.allContacts];

    this.userContacts = this.userContacts.filter(
      (contact) =>
        contact['email'].toLowerCase().includes(this.value.toString()) ||
        contact['firstname'].toLowerCase().includes(this.value.toString()) ||
        contact['lastname'].toLowerCase().includes(this.value.toString()) ||
        contact['mobile'].toLowerCase().includes(this.value.toString())
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
