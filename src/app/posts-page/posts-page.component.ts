import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../_models/post';
import { PostService } from '../_services/post.service';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.css']
})
export class PostsPageComponent implements OnInit, OnDestroy {

  accessTokenSubscription: Subscription;
  postsSubscription: Subscription;
  posts: Post[];

  constructor(
    private postService: PostService,
  ) { }
  
  ngOnInit(): void {
    this.postsSubscription = this.postService.userPostsObservable.subscribe({
      next: (post) => {
        this.posts = post;
      }
    });
    this.postService.getUserPosts().subscribe();
  }

  ngOnDestroy(): void {
    this.accessTokenSubscription.unsubscribe();
    this.postsSubscription.unsubscribe();
  }

}
