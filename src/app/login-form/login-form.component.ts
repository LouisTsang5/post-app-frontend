import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public get formValue() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.loading = true;

    this.authenticationService
    .login(this.formValue['email'].value, this.formValue['password'].value)
    .pipe(first())
    .subscribe({
      next: (res) => {
        console.log(res);
        this.errorMessage = '';
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401) { 
          this.errorMessage = 'Incorrect email or password';
          this.loading = false;
        }
        else { 
          throw err 
        }
      }
    });
  }

}
