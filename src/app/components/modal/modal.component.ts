import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  addressForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Record<string, string | Record<string, string>>,
    private dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.addressForm = this.fb.group({
      firstname: [
        this.data['dialogData'] !== undefined
          ? this.data['dialogData']['firstname' as keyof Object]
          : '',
        Validators.required,
      ],
      lastname: [
        this.data['dialogData']
          ? this.data['dialogData']['lastname' as keyof Object]
          : null,
        Validators.required,
      ],
      email: [
        this.data['dialogData']
          ? this.data['dialogData']['email' as keyof Object]
          : null,
        [Validators.required, Validators.email],
      ],
      mobile: [
        this.data['dialogData']
          ? this.data['dialogData']['mobile' as keyof Object]
          : null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^(07\d{8}|011\d{7})$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    console.log(this.data['dialogData']);
  }

  onSubmit(): void {
    let fname: string =
      this.addressForm.controls['firstname'].value!.toString();
    let lname: string = this.addressForm.controls['lastname'].value!.toString();
    let em: string = this.addressForm.controls['email'].value!.toString();
    let mobile: string = this.addressForm.controls['mobile'].value!.toString();
    console.log(em, fname, lname, mobile);
    if (this.data['dialogTitle'] == 'Add Contact') {
      this.firebaseService.saveContact(fname, lname, em, mobile);
    } else {
      let oldMobile =
        this.data['dialogData']['mobile' as keyof Object].toString();
      this.firebaseService.updateContact(fname, lname, em, mobile, oldMobile);
      console.log(this.addressForm.controls, oldMobile);
    }

    this.dialogRef.close();
  }
}
