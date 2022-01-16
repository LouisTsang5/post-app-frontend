import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  registrationForm: FormGroup;
  submitted = false;
  loading = false;

  passwordAndConfirmValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    console.log('va');
    const password = group.get('password')?.value;
    const passwordConfirm = group.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { passwordNotSame: true };
  }

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      alias: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    }, { validator: this.passwordAndConfirmValidator });
  }

  public get formValue() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
  }

}
