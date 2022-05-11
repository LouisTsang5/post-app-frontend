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
        //Initialize with empty access token value
        this.accessTokenSubject = new BehaviorSubject<AccessToken | undefined>(undefined);
        this.accessTokenObservable = this.accessTokenSubject.asObservable();

        //Initialize with empty current user value
        this.currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
        this.currentUserObservable = this.currentUserSubject.asObservable();

        //Set access token value
        this.accessToken = this.accessToken;
    }

    public get accessToken(): AccessToken | undefined {
        const accessTokenStr = localStorage.getItem(this.accessTokenKey);
        let accessToken = accessTokenStr ? JSON.parse(accessTokenStr) as AccessToken : undefined;
        const isTokenValid = accessToken && !this.isAccessTokenExpired(accessToken);
        if (!isTokenValid) accessToken = undefined;

        //Set the access token if the token is not the same
        if (!this.isTokenSame(this.accessTokenSubject.value, accessToken)) this.accessToken = accessToken;

        return accessToken;
    }

    public set accessToken(token: AccessToken | undefined) {
        if (!token) {
            this.accessTokenSubject.next(undefined);
            localStorage.removeItem(this.accessTokenKey);
            this.currentUser = undefined;
            return;
        }

        if (this.isAccessTokenExpired(token)) throw new Error('Cannot set expired access token');
        localStorage.setItem(this.accessTokenKey, JSON.stringify(token));
        this.accessTokenSubject.next(token);
        this.setCurrentUserFromServer();
    }

    public get currentUser() {
        // return this.currentUserSubject.value;
        const currentUserStr = this.accessToken ? localStorage.getItem(this.currentUserKey) : undefined;
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) as User : undefined;

        //Set the current user if the users are not the same
        if (this.currentUserSubject.value != currentUser) this.currentUser = currentUser;

        return currentUser;
    }

    public set currentUser(user: User | undefined) {
        if (!user) {
            this.currentUserSubject.next(undefined);
            localStorage.removeItem(this.currentUserKey);
            return;
        }

        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
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
        return Date.parse(accessToken.expireDate) <= Date.parse(new Date().toISOString());
    }

    private async getCurrentUserFromServer(token?: AccessToken) {
        const url = new URL(`${this.requestUrl.pathname}/self`, this.requestUrl.origin);
        const headers = token ? new HttpHeaders({ 'x-access-token': token.token as string }) : this.requestHeader;
        const user: User = await firstValueFrom(this.http.get(url.toString(), { headers }) as Observable<User>)
        return user as User;
    }

    private isTokenSame(tokenA?: AccessToken, tokenB?: AccessToken) {
        if (!tokenA && !tokenB) return true;
        if (!tokenA || !tokenB) return false;
        if (tokenA.token === tokenB.token && tokenA.expireDate === tokenB.expireDate) return true;
        return false;
    }

    private async setCurrentUserFromServer(token?: AccessToken) {
        this.currentUser = await this.getCurrentUserFromServer(token);
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
                })
            );
    }

    public logout() {
        this.accessToken = undefined;
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
                })
            );
    }
}