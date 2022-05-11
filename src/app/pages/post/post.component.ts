import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/_models/post';
import { PostService } from 'src/app/_services/post.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

    private id: string;
    post: Post;

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit(): Promise<void> {
        this.id = this.route.snapshot.queryParams['id'];
        this.post = await this.postService.getPost(this.id);
    }

}
