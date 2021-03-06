import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../_models/user';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
    selector: 'app-top-utility-bar',
    templateUrl: './top-utility-bar.component.html',
    styleUrls: ['./top-utility-bar.component.scss']
})
export class TopUtilityBarComponent implements OnInit, OnDestroy {

    currentUser: User;
    currentUserSubscription: Subscription;

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.currentUserSubscription = this.authenticationService.currentUserObservable.subscribe({
            next: (user?) => {
                if (user)
                this.currentUser = user;
            }
        });
    }

    ngOnDestroy(): void {
        this.currentUserSubscription.unsubscribe();
    }

    public onLogout() {
        this.authenticationService.logout();
    }

    onClickHome() {
        this.router.navigate(['/']);
    }
}