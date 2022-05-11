import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
        private postService: PostService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        return;
    }

    onClickDelete(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const post = this.post;
        if (confirm(`Are you sure you want to delete the post titled ${post.title}?`)) this.postService.deletePost(post.id);
    }

    onClickPost(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.router.navigate(['post'], { queryParams: { id: this.post.id } });
    }
}
