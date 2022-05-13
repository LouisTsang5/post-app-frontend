import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../../_models/post';
import { AuthenticationService } from '../../../_services/authentication.service';
import { PostService } from '../../../_services/post.service';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {

    postsSubscription: Subscription;
    posts: Post[];

    displayCreatePostForm = false;

    constructor(
        private postService: PostService,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit(): void {
        if (!this.authenticationService.accessToken) return;
        this.postsSubscription = this.postService.userPostsObservable.subscribe({
            next: (posts) => {
                this.posts = posts;
            }
        });
        this.postService.getUserPosts();
    }

    ngOnDestroy(): void {
        if (this.postsSubscription) this.postsSubscription.unsubscribe();
    }

    onClickCreatePost() {
        this.displayCreatePostForm = true;
    }

    onCancelCreatePost = () => {
        this.displayCreatePostForm = false;
    };

    onSubmitCreatePostForm = () => {
        this.displayCreatePostForm = false;
    };
}
