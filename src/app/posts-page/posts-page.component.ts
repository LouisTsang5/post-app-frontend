import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../_models/post';
import { AuthenticationService } from '../_services/authentication.service';
import { PostService } from '../_services/post.service';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent implements OnInit, OnDestroy {

  postsSubscription: Subscription;
  posts: Post[];

  constructor(
    private postService: PostService,
    private authenticationService: AuthenticationService
  ) { }
  
  ngOnInit(): void {
    this.postsSubscription = this.postService.userPostsObservable.subscribe({
      next: (post) => {
        this.posts = post;
      }
    });
    if (this.authenticationService.accessToken)
      this.postService.getUserPosts();
  }

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

}