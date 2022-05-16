import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';
import { User } from '../../_models/user';
import { AuthenticationService } from '../../_services/authentication.service';
import { UserService } from '../../_services/user.service';

@Component({
    selector: 'app-register-page',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegistrationComponent implements OnInit {

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
    passwordAndConfirmValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('passwordConfirm')?.value;
        return password === passwordConfirm ? null : { passwordNotSame: true };
    };

    aliasExistsValidator: AsyncValidatorFn = (aliasControl: AbstractControl): Observable<ValidationErrors | null> => {
        const alias = aliasControl.value;
        return this.userService.getUser(alias)
            .pipe(
                map((res) => {
                    return res ? { aliasExists: true } : null;
                })
            );
    };

    emailExistsValidator: AsyncValidatorFn = (emailControl: AbstractControl): Observable<ValidationErrors | null> => {
        const email = emailControl.value;
        return this.userService.getUser('', email)
            .pipe(
                map((res) => {
                    return res ? { emailExists: true } : null;
                })
            );
    };

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.registrationForm = this.formBuilder.group({
            alias: ['', Validators.required, this.aliasExistsValidator],
            email: ['', Validators.required, this.emailExistsValidator],
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
                }
            });
    }

}
