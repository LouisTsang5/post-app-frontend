import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../_models/post';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private userPostsSubject: BehaviorSubject<Post[]>;
  public userPostsObservable: Observable<Post[]>;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    this.userPostsSubject = new BehaviorSubject<Post[]>([]);
    this.userPostsObservable = this.userPostsSubject.asObservable();
  }

  getUserPosts() {
    if (!this.authenticationService.accessToken)
      throw new Error('No access token available');

    const url = `${environment.apiURL}/post`;
    const headers = new HttpHeaders({ 'x-access-token': this.authenticationService.accessToken?.token as string });
    this.http.get(url, {headers: headers})
    .pipe(
      first(),
      map((res: any) => {
        if (!res)
          return [];

        const posts: Post[] = [];
        for (let i = 0; i < res.length; i++) {
          posts.push({
            title: res[i].title,
            content: res[i].content
          });
        }
        return posts;
      }),
      map((posts) => {
        this.userPostsSubject.next(posts);
        return posts;
      })
    ).subscribe();
  }

  createPost(post: Post) {
    if (!this.authenticationService.accessToken)
      throw new Error('No access token available');

    const url = `${environment.apiURL}/post`;
    const headers = new HttpHeaders({ 'x-access-token': this.authenticationService.accessToken?.token as string });
    this.http.post(url, post, {headers: headers})
    .pipe(
      first(),
      map((res) => {
        this.getUserPosts();
      })
    ).subscribe();
  }
}
