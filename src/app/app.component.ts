import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccessToken } from './_models/accessToken';
import { User } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'post-app-frontend';
    userSubscription: Subscription;
    user?: User;
    accessTokenSubscription: Subscription;
    accessToken?: AccessToken;

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userSubscription = this.authenticationService.currentUserObservable.subscribe({
            next: (user) => {
                this.user = user;
            }
        });
        this.accessTokenSubscription = this.authenticationService.accessTokenObservable.subscribe({
            next: (token) => {
                const currentRoute = this.router.url;
                if (!token) this.router.navigate(['login'], { queryParams: { returnUrl: currentRoute } });
                this.accessToken = token;
            }
        });
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
        this.accessTokenSubscription.unsubscribe();
    }
}
