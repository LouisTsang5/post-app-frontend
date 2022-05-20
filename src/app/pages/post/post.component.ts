import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/_models/post';
import { LoggerService } from 'src/app/_services/logger.service';
import { PostService } from 'src/app/_services/post.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

    private id: string;
    post: Post;
    mediaUrls: string[];
    editMode = false;
    editPostForm: FormGroup;

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private logger: LoggerService,
        private formBuilder: FormBuilder,
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
            this.mediaUrls = urls;
        }
        console.dir(this.post);
        this.editPostForm = this.formBuilder.group({
            title: this.post.title,
            content: this.post.content,
        });
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }
}
