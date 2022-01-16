import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public getUser(alias?: string, email?: string): Observable<User | null> {
    if (!alias && !email) {
        throw new Error('No alias or email provided');
    }

    const url = `${environment.apiURL}/user/query`;
    const query = {} as any;
    if (alias) query['alias'] = alias;
    if (email) query['email'] = email;
    return this.http.get(url, query)
    .pipe(
        map((res: any) => {
            if (res) {
                const user = {
                    email: res.email,
                    alias: res.alias,
                } as User;
                return user;
            }
            return null;
        })
    );
}
}
