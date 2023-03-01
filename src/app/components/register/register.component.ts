import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  addressForm = this.fb.group(
    {
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    }
  );

  hasUnitNumber = false;

  constructor(private fb: FormBuilder, private auth: FirebaseService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    let em: string = this.addressForm.controls['email'].value!;
    let pass: string = this.addressForm.controls['password'].value!;
    this.auth.SignUp(em, pass);
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];

      const matchingControl = formGroup.controls[matchingControlName];

      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
