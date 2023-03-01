import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  addressForm = this.fb.group({
    firstname: [{value: this.data ? this.data['dialogData']['firstname' as keyof Object] : null}, Validators.required],
    lastname: [{value: this.data ? this.data['dialogData']['lastname' as keyof Object] : null}, Validators.required],
    email: [{value: this.data ? this.data['dialogData']['email' as keyof Object] : null}, [Validators.required, Validators.email]],
    mobile: [
      {value: this.data ? this.data['dialogData']['mobile' as keyof Object] : null},
      [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^(07\d{8}|011\d{7})$/),
      ],
    ],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Record<string, string | Record<string, string>>,
    private dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    
  }

  onSubmit(): void {
    let fname: string = this.addressForm.controls['firstname'].value!.toString();
    let lname: string = this.addressForm.controls['lastname'].value!.toString();
    let em: string = this.addressForm.controls['email'].value!.toString();
    let mobile: string = this.addressForm.controls['mobile'].value!.toString();
    console.log(em, fname, lname, mobile);
    console.log(this.addressForm.controls);
    this.firebaseService.saveContact(fname, lname, em, mobile);

    this.dialogRef.close();
  }
}
