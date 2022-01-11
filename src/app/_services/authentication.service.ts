import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { User } from "../_user/user.model";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private currentUser: Observable<User>;

    constructor(
        private http: HttpClient
    ) {
        //Initialize current user from local storage
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') as string));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public login(email: string, password: string) {
        const url = `${environment.apiURL}/user/login`
        return this.http.post(url, {email, password})
        .pipe(map(function(res: any) {
            
        }));
    }
}