import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { User } from "../_models/user";
import { environment } from "src/environments/environment";
import { AccessToken } from "../_models/accessToken";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User | undefined>;
    public currentUserObservable: Observable<User | undefined>;
    private currentUserKey = 'currentUser';

    private accessTokenSubject: BehaviorSubject<AccessToken | undefined>;
    public accessTokenObservable: Observable<AccessToken | undefined>;
    private accessTokenKey = 'accessToken';

    constructor(
        private http: HttpClient
    ) {
        //Initialize access token from local storage
        const accessTokenStr = localStorage.getItem(this.accessTokenKey);
        let accessToken = accessTokenStr ? JSON.parse(accessTokenStr) as AccessToken : undefined;
        if (accessToken && this.isAccessTokenExpired(accessToken)) accessToken = undefined;
        this.accessTokenSubject = new BehaviorSubject<AccessToken | undefined>(accessToken);
        this.accessTokenObservable = this.accessTokenSubject.asObservable();

        //Initialize current user from local storage
        const currentUserStr = accessToken ? localStorage.getItem(this.currentUserKey) : undefined;
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) as User : undefined;
        this.currentUserSubject = new BehaviorSubject<User | undefined>(currentUser);
        this.currentUserObservable = this.currentUserSubject.asObservable();
    }

    public get currentUser() {
        return this.currentUserSubject.value;
    }

    public set currentUser(user: User | undefined) {
        if (!user)
            throw new Error('Cannot set user as null');

        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    public get accessToken(): AccessToken | undefined {
        const accessToken = this.accessTokenSubject.value;
        return accessToken && !this.isAccessTokenExpired(accessToken) ? accessToken : undefined;
    }

    public set accessToken(token: AccessToken | undefined) {
        if (!token) throw new Error('Cannot set access token as null');
        if (this.isAccessTokenExpired(token)) throw new Error('Cannot set expired access token');
        localStorage.setItem(this.accessTokenKey, JSON.stringify(token));
        this.accessTokenSubject.next(token);
    }

    private get requestUrl() {
        return new URL(`${environment.apiURL}/user`);
    }

    private get requestHeader() {
        if (!this.accessToken)
            throw new Error('No access token available');
        return new HttpHeaders({ 'x-access-token': this.accessToken.token as string });
    }

    private isAccessTokenExpired(accessToken: AccessToken) {
        const currentDate = new Date();
        return Date.parse(accessToken.expireDate) <= Date.parse(currentDate.toDateString())
    }

    private async getCurrentUser(token?: AccessToken) {
        const url = new URL(`${this.requestUrl.pathname}/self`, this.requestUrl.origin);
        const headers = token ? new HttpHeaders({ 'x-access-token': token.token as string }) : this.requestHeader;
        const user: User = await firstValueFrom(this.http.get(url.toString(), { headers }) as Observable<User>)
        return user as User;
    }

    public login(email: string, password: string): Observable<void> {
        const url = `${environment.apiURL}/user/login`;
        return this.http.post(url, { email, password })
            .pipe(
                //Get response and return token
                map((res: any) => {
                    if (!res || !(res.token && res.expiryDate)) {
                        throw new Error('Unable to obtain access token');
                    }

                    //Set access token
                    const token = {
                        token: res.token,
                        expireDate: res.expiryDate,
                    } as AccessToken;
                    this.accessToken = token;

                    return token;
                }),
                //Get user info from token
                map((token) => {
                    this.getCurrentUser(token).then((user) => this.currentUser = user);
                })
            );
    }

    public logout() {
        localStorage.removeItem(this.currentUserKey);
        this.currentUserSubject.next(undefined);
        localStorage.removeItem(this.accessTokenKey);
        this.accessTokenSubject.next(undefined);
    }

    public register(userInfo: User, password: string): Observable<void> {
        const url = `${environment.apiURL}/user/register`;
        const registrationInfo = {
            email: userInfo.email,
            alias: userInfo.alias,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            password: password,
        };
        return this.http.post(url, registrationInfo)
            .pipe(
                map((res: any) => {
                    if (!res || !res.userInfo || !res.accessToken) {
                        throw new Error('unable to register user');
                    }

                    //Set access token
                    this.accessToken = {
                        token: res.accessToken.token,
                        expireDate: res.accessToken.expiryDate,
                    } as AccessToken;

                    //Set user info
                    this.currentUser = {
                        alias: res.userInfo.alias,
                        email: res.userInfo.email,
                        firstName: res.userInfo.firstName,
                        lastName: res.userInfo.lastName,
                    } as User;
                })
            );
    }
}