import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { User } from "../_models/user.model";
import { environment } from "src/environments/environment";
import { AccessToken } from "../_models/accessToken.model";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUserObservable: Observable<User>;
    private currentUserKey = 'currentUser';

    private accessTokenSubject: BehaviorSubject<AccessToken>;
    private accessTokenObservable: Observable<AccessToken>;
    private accessTokenKey = 'accessToken';

    constructor(
        private http: HttpClient
    ) {
        //Initialize current user from local storage
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.currentUserKey) as string));
        this.currentUserObservable = this.currentUserSubject.asObservable();

        //Initialize access token from local storage
        this.accessTokenSubject = new BehaviorSubject<AccessToken>(JSON.parse(localStorage.getItem(this.accessTokenKey) as string));
        this.accessTokenObservable = this.accessTokenSubject.asObservable();
    }

    public get currentUser(): User {
        return this.currentUserSubject.value;
    }

    public get accessToken(): AccessToken | null {
        const accessToken = this.accessTokenSubject.value;
        const currentDate = new Date();
        return accessToken && Date.parse(accessToken.expireDate) > Date.parse(currentDate.toDateString()) ? accessToken : null; //return null if token has expired or no token at all
    }

    public login(email: string, password: string): Observable<AccessToken> {
        const url = `${environment.apiURL}/user/login`;
        return this.http.post(url, {email, password})
        .pipe(
            //Get response and return token
            map(res => {
                if (!res || !((res as any).token && (res as any).expiryDate)) {
                    throw new Error('Unable to obtain access token');
                }

                const token = {
                    token: (res as any).token,
                    expireDate: (res as any).expiryDate,
                } as AccessToken;

                //Set access token
                localStorage.setItem(this.accessTokenKey, JSON.stringify(token));
                this.accessTokenSubject.next(token);

                return token;
            }),
            //Get user info from token
            map(token => {
                const userUrl = `${environment.apiURL}/user/self`;
                const headers = new HttpHeaders({ 'x-access-token': token.token });
                this.http.get(userUrl, { headers }).subscribe({
                    next: (res) => {
                        const { email, alias, firstName, lastName } = res as any;
                        const user = { email, alias, firstName, lastName } as User;
                        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                })
                return token;
            })
        );
    }
}