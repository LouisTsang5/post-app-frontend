import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/_models/post';
import { PostService } from 'src/app/_services/post.service';

@Component({
    selector: 'app-post-preview',
    templateUrl: './post-preview.component.html',
    styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent implements OnInit {

    @Input() post: Post;
    displayConfirmDelte = false;

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
        this.displayConfirmDelte = true;
    }

    onClickConfirmDelete(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.postService.deletePost(this.post.id);
    }

    onClickCancelDelete(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.displayConfirmDelte = false;
    }

    onClickPost(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.router.navigate(['post'], { queryParams: { id: this.post.id } });
    }
}
