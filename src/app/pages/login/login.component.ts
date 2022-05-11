import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    submitted = false;
    loading = false;
    errorMessage = '';
    returnUrl = '/';

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    }

    public get formValue() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) return;

        this.loading = true;

        this.authenticationService
            .login(this.formValue['email'].value, this.formValue['password'].value)
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
                    if (err.status === 401) {
                        this.errorMessage = 'Incorrect email or password';
                    }
                    else {
                        console.log(err);
                        this.errorMessage = 'Login failed. Please read the console log.';
                    }
                }
            });
    }

    onRegister() {
        this.router.navigate(['register'], { queryParams: { returnUrl: this.returnUrl } });
    }
}
