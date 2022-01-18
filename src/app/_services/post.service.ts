import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../_models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient
  ) { }

  getUserPosts(): Observable<Post[]> {
    const url = `${environment.apiURL}/post`;
    return this.http.get(url)
    .pipe(
      map((res: any) => {
        const posts: Post[] = [];
        for (let i = 0; i < res.length; i++) {
          posts.push({
            title: res[i].title,
            content: res[i].content
          });
        }
        return posts;
      })
    );
  }
}
