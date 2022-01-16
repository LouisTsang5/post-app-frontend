import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { User } from '../_models/user';
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
  errorMessage = '';
  returnUrl = '/';

  //Form value getter
  public get formValue() {
    return this.registrationForm.controls;
  }

  //Validators
  passwordAndConfirmValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const passwordConfirm = group.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { passwordNotSame: true };
  }

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    //Do nothing if the form is invalid
    if (this.registrationForm.invalid) {
      this.loading = false;
      return;
    }

    const user = {
      alias: this.formValue['alias'].value,
      email: this.formValue['email'].value,
      firstName: this.formValue['firstName'].value,
      lastName: this.formValue['lastName'].value,
    } as User;
    const password = this.formValue['password'].value;

    //Register
    this.authenticationService.register(user, password)
    .pipe(
      first(),
      finalize(() => { this.loading = false; }) // always turn loading false
    )
    .subscribe({
      next: () => {
        this.errorMessage = '';
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Registration failed. Please read the console log.';
      },
      complete: () => {
        console.log('completed');
      }
    });
  }

}
