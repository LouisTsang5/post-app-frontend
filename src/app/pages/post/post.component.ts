import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/_models/post';
import { LoggerService } from 'src/app/_services/logger.service';
import { PostService } from 'src/app/_services/post.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

    private id: string;
    post: Post;
    mediaUrls: string[];

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private logger: LoggerService,
    ) { }

    async ngOnInit(): Promise<void> {
        this.id = this.route.snapshot.queryParams['id'];
        this.post = await this.postService.getPost(this.id);
        if (this.post.multiMedia) {
            const urls = await Promise.all(
                this.post.multiMedia.map(async (media) => {
                    return await this.postService.getMedia(this.post.id, media.index);
                })
            );
            this.logger.log(`Media urls ${urls.join(', ')}`);
            this.mediaUrls = urls
        }
    }

}
