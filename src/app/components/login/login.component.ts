import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  addressForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  hasUnitNumber = false;

  constructor(private fb: FormBuilder, private auth: FirebaseService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    let em: string = this.addressForm.controls['email'].value!;
    let pass: string = this.addressForm.controls['password'].value!;
    this.auth.SignUp(em, pass);
  }
}
