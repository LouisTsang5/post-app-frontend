import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post, PostFormData } from '../_models/post';
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

  private get requestUrl() {
    return `${environment.apiURL}/post`;
  }

  private get requestHeader() {
    if (!this.authenticationService.accessToken)
      throw new Error('No access token available');
    return new HttpHeaders({ 'x-access-token': this.authenticationService.accessToken?.token as string });
  }

  getUserPosts() {
    this.http.get(this.requestUrl, {headers: this.requestHeader})
    .pipe(
      first(),
      map((res: any) => {
        if (!res)
          return [];

        const posts: Post[] = [];
        for (let i = 0; i < res.length; i++) {
          const post = res[i] as Post;
          posts.push(post);
        }
        return posts;
      }),
      map((posts) => {
        this.userPostsSubject.next(posts);
        return posts;
      })
    ).subscribe();
  }

  createPost(post: PostFormData) {
    //Transform post form data to form data
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    if (post.multimedia) post.multimedia.map((file) => formData.append('multimedia', file, file.name));

    //Post to api
    this.http.post(this.requestUrl, formData, {headers: this.requestHeader})
    .pipe(
      first(),
      map((res) => {
        this.getUserPosts();
      })
    ).subscribe();
  }

  deletePost(id: string) {
    const apiUrl = new URL(this.requestUrl);
    const url = new URL(`${apiUrl.pathname}/${id}`, apiUrl.origin).toString();
    this.http.delete(url, {headers: this.requestHeader})
    .pipe(
      first(),
      map(() => this.getUserPosts())
    ).subscribe();
  }
}
