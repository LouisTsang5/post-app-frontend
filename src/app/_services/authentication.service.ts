import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { User } from "../_user/user.model";
import { environment } from "src/environments/environment";
import { AccessToken } from "../_user/accessToken.model";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUser: Observable<User>;
    private currentUserKey = 'currentUser';

    private accessTokenSubject: BehaviorSubject<AccessToken>;
    private accessToken: Observable<AccessToken>;
    private accessTokenKey = 'accessToken';

    constructor(
        private http: HttpClient
    ) {
        //Initialize current user from local storage
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.currentUserKey) as string));
        this.currentUser = this.currentUserSubject.asObservable();

        //Initialize access token from local storage
        this.accessTokenSubject = new BehaviorSubject<AccessToken>(JSON.parse(localStorage.getItem(this.accessTokenKey) as string));
        this.accessToken = this.accessTokenSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get accessTokenValue(): AccessToken {
        return this.accessTokenSubject.value;
    }

    public login(email: string, password: string) {
        const url = `${environment.apiURL}/user/login`
        return this.http.post(url, {email, password})
        .pipe(
            map(res => {
                if (!((res as any).token && (res as any).expiryDate))
                    return res;

                const token = {
                    token: (res as any).token,
                    expireDate: (res as any).expiryDate,
                } as AccessToken;

                //Set access token
                localStorage.setItem(this.accessTokenKey, JSON.stringify(token));
                this.accessTokenSubject.next(token);

                return res;
            }),
        );
    }
}