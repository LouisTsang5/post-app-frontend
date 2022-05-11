import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/_models/post';
import { PostService } from 'src/app/_services/post.service';

@Component({
    selector: 'app-post-preview',
    templateUrl: './post-preview.component.html',
    styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit {

    @Input() post: Post;

    constructor(
        private postService: PostService
    ) { }

    ngOnInit(): void {
        return;
    }

    onClickDelete() {
        const post = this.post;
        if (confirm(`Are you sure you want to delete the post titled ${post.title}?`)) this.postService.deletePost(post.id);
    }
}
